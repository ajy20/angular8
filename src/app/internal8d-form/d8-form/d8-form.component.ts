import { Component, OnInit, ViewChild } from '@angular/core';
import { StepD8, StepD8Api, RestApiRecognizeTeam, RecognizeTeamMember, RestApiFinalVerification, FinalVerificationResult } from '../shared/models/stepD8';
import { HttpService } from 'src/app/shared/services/http.service';
import { RestApi } from 'src/app/shared/class/rest-api';
import { DStatus, ConfirmationMessage, ConfirmationHeader, AILoggerPageName, AILoggerAction } from '../shared/models/enums';
import { SidebarService } from 'src/app/shared/services/sidebar.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastMsg, ToastMessage } from 'src/app/shared/class/toast-msg';
import { RestApiAttachments, Attachment } from 'src/app/incident/shared/models/attachment';
import { RoleConstant, FileUploadSize } from 'src/app/shared/class/constant';
import { User } from 'src/app/models/user';
import { GraphService } from 'src/app/shared/services/graph.service';
import { NgForm } from '@angular/forms';
import { MonitoringService } from 'src/app/shared/services/monitoring.service';

@Component({
  selector: 'app-d8-form',
  templateUrl: './d8-form.component.html',
  styleUrls: ['./d8-form.component.css']
})
export class D8FormComponent implements OnInit {
  @ViewChild('d8Form', { static: false }) d8Form: NgForm;

  incidentId: number;
  isEditable: boolean = false;
  currentRole: number;
  currentUser: number;
  stepNo: number = 8;
  attachments: Attachment[];
  uploadedFiles: any[] = [];
  fileCount: number;
  routeUrl: string;
  data: StepD8;
  approveD8Status: number;
  rejectD8Status: number;
  amIApprover: boolean;
  results: any;
  keyword: string = 'userPrincipalName';

  selectedPotentialCauseRow: number;
  formStatus: boolean;
  isApprovalRequestSent: boolean;
  isApprovalCompleted: boolean;
  isApprovalCompletedWithReject: boolean;
  hasApprovalHistory: boolean = false;
  selectedApprovalAction: DStatus = null;
  approvalComments: string = '';
  approveRejectModalConfirmMessage: string = '';
  savedProposedCorrectiveActions: number = 0;

  recognizeTeam: RecognizeTeamMember[];
  newRecognizeTeamMember: User;
  crossIconFlag: boolean = false;
  loadingGraphUserFlag: boolean = false;
  finalVerificationCheckResult: FinalVerificationResult[];
  hasErrorsInFinalVerificationCheck: boolean = false;
  isFinalVerificationCheckCompleted: boolean = false;
  isVerificationSuccessful: boolean = false;
  fileUploadSize: number = FileUploadSize.FILE_UPLOAD_SIZE;


  constructor(
    private sidebarSvc: SidebarService,
    private route: ActivatedRoute,
    private router: Router,
    private httpSvc: HttpService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private graphSvc: GraphService,
    private aiLoggerSvc: MonitoringService
  ) {
    this.approveD8Status = DStatus.APPROVE;
    this.rejectD8Status = DStatus.REJECT;
    this.newRecognizeTeamMember = new User();
  }

  ngOnInit() {
    this.is8DFormEditable();
    this.refreshInternal8D();
    this.sidebarSvc.internal8DTabChange('D8');
    this.incidentId = this.route.snapshot.params.id as number;
    this.currentUser = Number(sessionStorage.getItem('userId'));
    this.currentRole = Number(sessionStorage.getItem('currentRole'));
    this.getData();
    this.getRecognizeTeam();
    this.getAttachments();
    this.refreshInternal8D();
    this.aiLoggerSvc.AILogger(AILoggerPageName.D8,AILoggerAction.VIEW);
  }

  /// Check if Internal 8D Form is Editable
  is8DFormEditable() {
    this.sidebarSvc.internal8DFormSatus.subscribe(data => {
      this.sidebarSvc.is8DFormEditable == true ? this.isEditable = true : this.isEditable = false;
    });
  }

  getData() {
    if (this.incidentId > 0) {
      this.httpSvc.get<StepD8Api>(RestApi.d8_get.format(this.incidentId)).subscribe(data => {
        this.data = data.contents;
        this.isApprovalRequestSent = this.data.statusId != DStatus.NOT_REQUESTED;
        this.hasApprovalHistory = this.data.approverHistory != undefined && this.data.approverHistory != null && this.data.approverHistory.length > 0;
        this.checkCurrentUserIsApprover();
        this.checkIfApprovalIsCompletedWithReject();
        this.sidebarSvc.formStatus == false;
        this.refreshInternal8D();
      });
    }
  }

  refreshInternal8D() {
    this.sidebarSvc.refreshInternal8D();
  }

  /// to check if current user is available in D1 approver's list or not.
  checkCurrentUserIsApprover() {
    let currentUserGlobalId = sessionStorage.getItem("LoggedUserGID");
    let x = this.data && this.data.approverStatuses ? this.data.approverStatuses.find(p => p.globalId == currentUserGlobalId && p.statusId == DStatus.PENDING) : null;
    if (x)
      this.amIApprover = true;
    else
      this.amIApprover = false;
  }

  /// to check if all approers have updated their statuses and one / all of them have rejected the request.
  checkIfApprovalIsCompletedWithReject() {
    this.isApprovalCompletedWithReject = false;
    if (this.data && this.data.approverStatuses) {
      let pendingApprovals = this.data.approverStatuses.find(p => p.statusId == DStatus.PENDING);
      if (pendingApprovals == null) {
        let rejectedApprovals = this.data.approverStatuses.find(p => p.statusId == DStatus.REJECT);
        if (rejectedApprovals) {
          this.isApprovalCompletedWithReject = true;
          this.isApprovalCompleted = false;
        }
        else {
          this.isApprovalCompletedWithReject = false;
          if (this.data.approverStatuses.length > 0)
            this.isApprovalCompleted = true;
          else
            this.isApprovalCompleted = false;
        }
      }
    }
  }

  /// Get All Attachments by Incident Id
  getAttachments() {
    if (this.incidentId > 0) {
      this.httpSvc.get<RestApiAttachments>(RestApi.get_attachments.format(this.incidentId, this.stepNo)).subscribe(data => {
        this.attachments = data.contents;
        this.fileCount = this.attachments.length;
      });
    }
  }

  /// Delete Attachments
  deleteAttachment(id: number) {
    this.confirmationService.confirm({
      message: ConfirmationMessage.DELETE,
      header: ConfirmationHeader.DELETE,
      icon: 'pi pi-info-circle',
      accept: () => {
        if (JSON.parse(sessionStorage.getItem('userId')) != null) {
          this.data.createdBy = JSON.parse(sessionStorage.getItem('userId'));
          this.httpSvc.delete(RestApi.delete_attachment.format(id, this.data.createdBy)).subscribe(
            res => {
              this.messageService.add({ severity: ToastMsg.delete[res.status].status, summary: ToastMsg.delete[res.status].msg.format('Attachment') });
              if (res.status == 1) {
                this.aiLoggerSvc.AILogger(AILoggerPageName.D8,AILoggerAction.DELETE);
                this.getAttachments();
              }
            });
        }
      },
      reject: () => { }
    });
  }

  /// File Upload Start
  myUploader(event, form): void {
    if (event.files.length == 0) {
      return;
    }
    if (JSON.parse(sessionStorage.getItem('userId')) != null) {
      this.data.createdBy = JSON.parse(sessionStorage.getItem('userId'));
      let input = new FormData();
      for (let file of event.files) {
        input.append("files", file);
      }

      this.httpSvc.post(RestApi.incident_attachment.format(this.incidentId, this.stepNo, this.currentUser), input).subscribe(
        res => {
          this.messageService.add({ severity: ToastMsg.upload[res.status].status, summary: ToastMsg.upload[res.status].msg });
          form.clear();
          this.getAttachments();
        });
    }
  }
  /// File Upload End

  /// Step Navigation
  redirectToStep(tab: string) {
    if (this.sidebarSvc.formStatus == true) {
      this.confirmationService.confirm({
        message: ConfirmationMessage.UNSAVED_DATA,
        header: ConfirmationHeader.UNSAVED_DATA,
        icon: 'pi pi-info-circle',
        accept: () => {
          this.sidebarSvc.formStatus == false;
          this.navigateToStep(tab);
        },
        reject: () => { }
      });
    } else {
      this.navigateToStep(tab);
    }
  }

  navigateToStep(tabName: string) {
    let baseUri = this.router.url;
    let to = baseUri.lastIndexOf('/') + 1;
    baseUri = baseUri.substring(0, to);
    this.routeUrl = baseUri + tabName;
    this.router.navigate([`${this.routeUrl}`]);
  }

  saveAndMakeApprovalRequest() {
    this.runFinalVerificationCheck();

    if (this.isFinalVerificationCheckCompleted) {
      this.confirmationService.confirm({
        message: ConfirmationMessage.SEND_APPROVAL_REQUEST,
        header: ConfirmationHeader.SEND_APPROVAL_REQUEST,
        icon: 'pi pi-info-circle',
        accept: () => {
          this.httpSvc.post(RestApi.d8_send_approval_request.format(this.incidentId, this.currentUser), null).subscribe(
            res => {
              let status = '20';
              status += ("0" + res.status).slice(-2);
              this.messageService.add({ severity: ToastMessage[status].status, summary: ToastMessage[status].msg });
              if (res.status == 1) {
                this.getData();
              }
            });
        },
        reject: () => { }
      });
    }
  }

  cancelApprovalRequest() {
    this.confirmationService.confirm({
      message: ConfirmationMessage.CANCEL_APPROVAL_REQUEST,
      header: ConfirmationHeader.CANCEL_APPROVAL_REQUEST,
      icon: 'pi pi-info-circle',
      accept: () => {
        this.httpSvc.post(RestApi.d8_cancel_approval_request.format(this.incidentId, this.currentUser), null).subscribe(
          res => {
            let status = '21';
            status += ("0" + res.status).slice(-2);
            this.messageService.add({ severity: ToastMessage[status].status, summary: ToastMessage[status].msg });
            if (res.status == 1) {
              this.getData();
            }
          });
      },
      reject: () => { }
    });

  }

  approveRejectRequest() {
    if (this.selectedApprovalAction == DStatus.APPROVE || this.selectedApprovalAction == DStatus.REJECT) {
      this.httpSvc.post(RestApi.d8_approve_reject_status.format(this.incidentId, this.currentUser, this.selectedApprovalAction), { comments: this.approvalComments }).subscribe(
        res => {
          let status = '22';
          status += (this.selectedApprovalAction + '' + res.status).slice(-2);
          this.messageService.add({ severity: ToastMessage[status].status, summary: ToastMessage[status].msg });
          if (res.status == 1) {
            this.getData();
          }
        });
    }
  }

  getStatusText(id) {
    let x = this.data && this.data.approverStatuses ? this.data.approverStatuses.find(p => p.id == id) : null;
    let statusString: string = '';
    if (x) {
      if (x.statusId == DStatus.PENDING)
        statusString = 'Pending';
      else if (x.statusId == DStatus.APPROVE)
        statusString = 'Approved on ' + this.localizeDateStr(x.modifiedOn);
      else if (x.statusId == DStatus.REJECT)
        statusString = 'Rejected on ' + this.localizeDateStr(x.modifiedOn);
    }
    return statusString;
  }

  getHistoryStatusText(approversList, id) {
    let x = approversList ? approversList.find(p => p.id == id) : null;

    let statusString: string = '';
    if (x) {
      if (x.statusId == DStatus.PENDING)
        statusString = 'Pending';
      else if (x.statusId == DStatus.APPROVE)
        statusString = 'Approved on ' + this.localizeDateStr(x.modifiedOn);
      else if (x.statusId == DStatus.REJECT)
        statusString = 'Rejected on ' + this.localizeDateStr(x.modifiedOn);
    }
    return statusString;
  }


  localizeDateStr(date: Date) {
    return new Date(date.toString().replace('T', ' ') + ' UTC').toLocaleString();
  }

  setApprovalAction(statusId) {
    this.selectedApprovalAction = statusId;
    this.approvalComments = '';

    let statusName: string = '';
    if (this.selectedApprovalAction == DStatus.APPROVE)
      statusName = 'Approve';
    else if (this.selectedApprovalAction == DStatus.REJECT)
      statusName = 'Reject';
    this.approveRejectModalConfirmMessage = 'Do you want to ' + statusName + ' D8?'
  }

  resetApprovalAction() {
    this.approveRejectModalConfirmMessage = this.approvalComments = this.selectedApprovalAction = null;
  }

  // Recognize team member search event
  onChangeSearch(val: string) {
    this.crossIconFlag = false;
    this.loadingGraphUserFlag = true;
    if (val) {
      this.graphSvc.getEvents(val.toLowerCase()).then((events) => {
        this.results = events;
        if (this.results == undefined || this.results.length == 0) {
          this.loadingGraphUserFlag = false;
        }
      });
    }
  }

  /// Select an item from suggestion list
  selectSearchEvent(item) {
    let userEmail = item.userPrincipalName;
    let getglobalID = userEmail.split("@")[0];
    this.newRecognizeTeamMember.globalId = getglobalID;
    this.newRecognizeTeamMember.name = item.displayName;
    this.newRecognizeTeamMember.emailId = item.mail;
    this.newRecognizeTeamMember.modifiedBy = this.currentUser;
    this.saveRecognizeTeam();
  }

  /// Resets globalId, Name, Email Field
  inputClearSearch() {
    this.newRecognizeTeamMember = new User();
  }

  // Get Recognize Team members
  getRecognizeTeam() {
    if (this.incidentId > 0) {
      this.httpSvc.get<RestApiRecognizeTeam>(RestApi.d8_get_recognized_team.format(this.incidentId)).subscribe(data => {
        this.recognizeTeam = data.contents;
      });
    }
  }

  /// Add new member to recognized team
  saveRecognizeTeam() {
    this.httpSvc.post(RestApi.d8_save_recognized_team.format(this.incidentId, this.currentUser), this.newRecognizeTeamMember).subscribe(
      res => {
        let status = '12';
        status += ("0" + res.status).slice(-2);
        this.getRecognizeTeam();
        this.messageService.add({ severity: ToastMessage[status].status, summary: ToastMessage[status].msg });
        if (res.status == 1) {
          this.newRecognizeTeamMember = new User();
        }
      });
  }

  /// delete a member from recognized team
  deleteRecognizedTeamMember(id: number) {
    this.confirmationService.confirm({
      message: ConfirmationMessage.DELETE,
      header: ConfirmationHeader.DELETE,
      icon: 'pi pi-info-circle',
      accept: () => {
        if (JSON.parse(sessionStorage.getItem('userId')) != null) {

          this.httpSvc.delete(RestApi.d8_delete_recognized_team.format(this.incidentId, id, this.currentUser)).subscribe(
            res => {
              let status = '12';
              status += ("0" + res.status).slice(-2);
              this.messageService.add({ severity: ToastMessage[status].status, summary: ToastMessage[status].msg });
              if (res.status == 1) {
                this.getRecognizeTeam();
              }
            });
        }
      },
      reject: () => { }
    });
  }

  /// Run verification check
  runFinalVerificationCheck() {
    this.httpSvc.get<RestApiFinalVerification>(RestApi.d8_run_verification_check.format(this.incidentId, this.currentUser)).subscribe(
      res => {
        if (res.status == 1) {
          this.finalVerificationCheckResult = res.contents;
          if (this.finalVerificationCheckResult != null && this.finalVerificationCheckResult.length > 0) {
            this.hasErrorsInFinalVerificationCheck = true;
            this.isFinalVerificationCheckCompleted = false;
          }
          else {
            this.hasErrorsInFinalVerificationCheck = false;
            this.isFinalVerificationCheckCompleted = true;
          }
        }
      });
  }

}
