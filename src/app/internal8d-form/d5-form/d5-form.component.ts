import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { IgxGridComponent } from 'igniteui-angular';
import { StepD5, StepD5Api } from '../shared/models/stepD5';
import { SidebarService } from 'src/app/shared/services/sidebar.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpService } from 'src/app/shared/services/http.service';
import { RestApi } from 'src/app/shared/class/rest-api';
import { RoleConstant, EnumLookup, FileUploadSize } from 'src/app/shared/class/constant';
import { RestApiAttachments, Attachment } from 'src/app/incident/shared/models/attachment';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastMsg, ToastMessage } from 'src/app/shared/class/toast-msg';
import { from } from 'rxjs';
import { PotentialCause } from '../shared/models/stepD4';
import { find } from 'rxjs/operators';
import { RestApiData, Master } from 'src/app/models/master';
import { ConfirmationHeader, ConfirmationMessage, DStatus, AILoggerPageName, AILoggerAction } from '../shared/models/enums';
import { MonitoringService } from 'src/app/shared/services/monitoring.service';

@Component({
  selector: 'app-d5-form',
  templateUrl: './d5-form.component.html',
  styleUrls: ['./d5-form.component.css']
})
export class D5FormComponent implements OnInit {

  @ViewChild('d5Form', { static: false }) d5Form: NgForm;
  @ViewChild('close', { static: false }) close: ElementRef;
  @ViewChild('ProposedCorrectiveActions', { read: IgxGridComponent, static: false })
  public proposedCorrectiveActions: IgxGridComponent;

  incidentId: number;
  isEditable: boolean;
  currentRole: number;
  currentUser: number;
  stepNo: number = 5;
  sourceLst: Master[];
  causeTypeLst: Master[];
  attachments: Attachment[];
  uploadedFiles: any[] = [];
  fileCount: number;
  routeUrl: string;
  data: StepD5;
  approveD5Status: number;
  rejectD5Status: number;
  amIApprover: boolean;

  selectedPotentialCauseRow: number;
  currentCorrectiveAction: PotentialCause;
  editModalData: PotentialCause;
  formStatus: boolean;
  isApprovalRequestSent: boolean;
  isApprovalCompleted: boolean;
  isApprovalCompletedWithReject: boolean;
  hasApprovalHistory: boolean = false;
  selectedApprovalAction: DStatus = null;
  approvalComments: string = '';
  approveRejectModalConfirmMessage: string = '';
  savedProposedCorrectiveActions: number = 0;
  fileUploadSize: number = FileUploadSize.FILE_UPLOAD_SIZE;

  constructor(
    private sidebarSvc: SidebarService,
    private route: ActivatedRoute,
    private router: Router,
    private httpSvc: HttpService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private aiLoggerSvc: MonitoringService
  ) {
    this.approveD5Status = DStatus.APPROVE;
    this.rejectD5Status = DStatus.REJECT;
  }

  ngOnInit() {
    this.is8DFormEditable();
    this.refreshInternal8D();
    this.sidebarSvc.internal8DTabChange('D5');
    this.incidentId = this.route.snapshot.params.id as number;
    this.currentUser = Number(sessionStorage.getItem('userId'));
    this.currentRole = Number(sessionStorage.getItem('currentRole'));
    this.getDropDownData();
    this.getData();
    this.getAttachments();
    this.refreshInternal8D();
    this.aiLoggerSvc.AILogger(AILoggerPageName.D5,AILoggerAction.VIEW);
  }

  /// Check if Internal 8D Form is Editable
  is8DFormEditable() {
    this.sidebarSvc.internal8DFormSatus.subscribe(data => {
      this.sidebarSvc.is8DFormEditable == true ? this.isEditable = true : this.isEditable = false;
    });
  }

  refreshInternal8D() {
    this.sidebarSvc.refreshInternal8D();
  }

  getDropDownData() {
    this.httpSvc.get<RestApiData>(RestApi.lookup_master.format(EnumLookup.ROOT_CAUSE_SOURCE)).subscribe(data => {
      this.sourceLst = data.contents;
      this.sourceLst.push({ id: -1, lookupValue: 'Other' });
    });
    this.httpSvc.get<RestApiData>(RestApi.lookup_master.format(EnumLookup.CAUSE_TYPE)).subscribe(data => {
      this.causeTypeLst = data.contents;
    });
  }

  getData() {
    if (this.incidentId > 0) {
      this.httpSvc.get<StepD5Api>(RestApi.get_d5.format(this.incidentId)).subscribe(data => {
        this.data = data.contents;
        this.savedProposedCorrectiveActions = this.data.proposedCorrectiveActions ? this.data.proposedCorrectiveActions.length : 0;
        this.isApprovalRequestSent = this.data.statusId != DStatus.NOT_REQUESTED;
        this.hasApprovalHistory = this.data.approverHistory != undefined && this.data.approverHistory != null && this.data.approverHistory.length > 0;
        this.checkCurrentUserIsApprover();
        this.checkIfApprovalIsCompletedWithReject();
        this.sidebarSvc.formStatus = false;
        this.refreshInternal8D();
      });
    }
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

  refreshProposedCorrectiveActionsData() {
    this.httpSvc.get<StepD5Api>(RestApi.get_d5.format(this.incidentId)).subscribe(data => {
      this.data.proposedCorrectiveActions = data.contents.proposedCorrectiveActions;
    });
    this.currentCorrectiveAction = new PotentialCause();
    this.editModalData = this.currentCorrectiveAction;
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
                this.aiLoggerSvc.AILogger(AILoggerPageName.D5,AILoggerAction.DELETE);
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

  /// Edit Potential Cause
  editPotentialCause(id: number, rowIndex: number) {
    this.editModalData = new PotentialCause();
    this.selectedPotentialCauseRow = rowIndex;
    this.refreshProposedCorrectiveActionsData();
    from<PotentialCause[]>(this.data.proposedCorrectiveActions).pipe(find(x => x.id === id)).subscribe(
      data => {
        this.editModalData = data as PotentialCause;
      });
  }

  saveProposedCorrectiveActions() {
    this.proposedCorrectiveActions.updateRow(this.editModalData, this.selectedPotentialCauseRow);
    this.close.nativeElement.click();
    this.submitProposedCorrectiveActions();
  }

  /// Close modal
  CloseModal() {
    this.editModalData = new PotentialCause();
    this.refreshProposedCorrectiveActionsData();
  }

  /// Submit proposed corrective actions for D4 Step to Database
  submitProposedCorrectiveActions() {
    if (Number(sessionStorage.getItem('userId')) != null || Number(sessionStorage.getItem('currentRole')) != RoleConstant.user) {
      this.currentUser = Number(sessionStorage.getItem('userId'));
      this.httpSvc.post(RestApi.save_proposed_corrective_actions.format(this.incidentId, this.currentUser), this.editModalData).subscribe(
        res => {
          let status = '12';
          status += ("0" + res.status).slice(-2);
          this.messageService.add({ severity: ToastMessage[status].status, summary: ToastMessage[status].msg });
          if (res.status == 1) {
            this.aiLoggerSvc.AILogger(AILoggerPageName.D5,AILoggerAction.SAVE);
            this.sidebarSvc.formStatus = false;
            this.refreshData();
          }
        });

      this.editModalData = new PotentialCause();
    }
  }

  //Submit D5 step details to database
  submit(showToast=true) {
    if (Number(sessionStorage.getItem('userId')) != null || Number(sessionStorage.getItem('currentRole')) != RoleConstant.user) {
      this.data.createdBy = Number(sessionStorage.getItem('userId'));
      this.httpSvc.post(RestApi.save_d5, this.data).subscribe(
        res => {
          if (showToast) {
            let status = '12';
            status += ("0" + res.status).slice(-2);
            this.messageService.add({ severity: ToastMessage[status].status, summary: ToastMessage[status].msg });
            if (res.status == 1) {
              this.aiLoggerSvc.AILogger(AILoggerPageName.D5,AILoggerAction.SAVE);
              this.sidebarSvc.formStatus = false;
              this.refreshInternal8D();
              this.refreshData();
            }
          }
        });
    }
  }

  refreshData() {
    this.close.nativeElement.click();
    this.getData();
  }

  /// Step Navigation
  redirectToStep(tab: string) {
    if (this.sidebarSvc.formStatus == true) {
      this.confirmationService.confirm({
        message: ConfirmationMessage.UNSAVED_DATA,
        header: ConfirmationHeader.UNSAVED_DATA,
        icon: 'pi pi-info-circle',
        accept: () => {
          this.sidebarSvc.formStatus = false;
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

  formIsDirty() {
    this.sidebarSvc.formStatus = true;
  }

  saveAndMakeApprovalRequest() {
    this.confirmationService.confirm({
      message: ConfirmationMessage.SEND_APPROVAL_REQUEST,
      header: ConfirmationHeader.SEND_APPROVAL_REQUEST,
      icon: 'pi pi-info-circle',
      accept: () => {
        this.submit(false);
        this.httpSvc.post(RestApi.d5_send_approval_request.format(this.incidentId, this.currentUser), null).subscribe(
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

  cancelApprovalRequest() {
    this.confirmationService.confirm({
      message: ConfirmationMessage.CANCEL_APPROVAL_REQUEST,
      header: ConfirmationHeader.CANCEL_APPROVAL_REQUEST,
      icon: 'pi pi-info-circle',
      accept: () => {
        this.submit(false);
        this.httpSvc.post(RestApi.d5_cancel_approval_request.format(this.incidentId, this.currentUser), null).subscribe(
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
      this.httpSvc.post(RestApi.d5_approve_reject_status.format(this.incidentId, this.currentUser, this.selectedApprovalAction), { comments: this.approvalComments }).subscribe(
        res => {
          let status = '20';
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
    this.approveRejectModalConfirmMessage = 'Do you want to ' + statusName + ' D5?'
  }

  resetApprovalAction() {
    this.approveRejectModalConfirmMessage = this.approvalComments = this.selectedApprovalAction = null;
  }
}
