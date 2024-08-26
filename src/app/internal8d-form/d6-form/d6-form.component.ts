import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpService } from 'src/app/shared/services/http.service';
import { MessageService, ConfirmationService } from 'primeng/api';
import { SidebarService } from 'src/app/shared/services/sidebar.service';
import { RestApi } from 'src/app/shared/class/rest-api';
import { StepD6Api, StepD6, CAVerifiers, CorrectiveActions } from '../shared/models/stepD6';
import { RoleConstant, Internal8DStep, EnumLookup, FileUploadSize } from 'src/app/shared/class/constant';
import { RestApiData, Master } from 'src/app/models/master';
import { RestApiAttachments, Attachment } from 'src/app/incident/shared/models/attachment';
import { ToastMsg, ToastMessage } from 'src/app/shared/class/toast-msg';
import { NgForm } from '@angular/forms';
import { from } from 'rxjs/internal/observable/from';
import { find } from 'rxjs/operators';
import { IgxGridComponent } from 'igniteui-angular';
import { DatePipe } from '@angular/common';
import { GraphService } from 'src/app/shared/services/graph.service';
import { User } from 'src/app/models/user';
import { ConfirmationHeader, ConfirmationMessage, AILoggerPageName, AILoggerAction } from '../shared/models/enums';
import { MonitoringService } from 'src/app/shared/services/monitoring.service';

@Component({
  selector: 'app-d6-form',
  templateUrl: './d6-form.component.html',
  styleUrls: ['./d6-form.component.css']
})
export class D6FormComponent implements OnInit {
  @ViewChild('d6Form', { static: false }) d6Form: NgForm;
  @ViewChild('close', { static: false }) close: ElementRef;
  @ViewChild("correctiveActionsGrid", { read: IgxGridComponent, static: false }) public correctiveActionsGrid: IgxGridComponent;

  d6StepDetails: StepD6;
  caVerifiers: CAVerifiers[];
  caVerifier: CAVerifiers;
  correctiveActions: CorrectiveActions[];
  correctiveAction: CorrectiveActions;
  sourceLst: Master[];
  selectedCorrectiveAction: number;
  incidentId: number;
  currentRole: number;
  currentUser: number;
  isEditable: boolean;
  d6StepAttachment: Attachment[];
  uploadedFiles: any[] = [];
  fileCount: number;
  uploadUrl: string;
  routeUrl: string;
  stepNo: number = Internal8DStep.d6Step;
  crossIconFlag: boolean = false;
  loadingGraphUserFlag: boolean = false;
  keyword: string = 'userPrincipalName';
  results: any;
  caVerifierCount: number;
  fileUploadSize: number = FileUploadSize.FILE_UPLOAD_SIZE;

  constructor(
    private router: Router,
    private httpSvc: HttpService,
    private messageService: MessageService,
    private sidebarSvc: SidebarService,
    private confirmationService: ConfirmationService,
    private datePipe: DatePipe,
    private graphSvc: GraphService,
    private route: ActivatedRoute,
    private aiLoggerSvc: MonitoringService
  ) {
    this.caVerifier = new CAVerifiers();
    this.uploadUrl = RestApi.incident_attachment;
  }

  ngOnInit() {
    this.is8DFormEditable();
    this.refreshInternal8D();
    this.getD6Details();
    this.getAttachments();
    this.aiLoggerSvc.AILogger(AILoggerPageName.D6,AILoggerAction.VIEW);
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

  /// Get D6 Step Details
  getD6Details() {
    this.incidentId = Number(this.route.snapshot.params.id);
    if (this.incidentId > 0) {
      this.httpSvc.get<StepD6Api>(RestApi.get_d6_by_id.format(this.incidentId)).subscribe(data => {
        this.d6StepDetails = data.contents;
        this.caVerifiers = this.d6StepDetails.caVerifiers;
        this.caVerifierCount = this.caVerifiers.length;
        this.correctiveActions = this.d6StepDetails.correctiveActions;
        this.d6StepDetails.d6DateCAEVerified == null ? this.d6StepDetails.d6DateCAEVerified = null : this.d6StepDetails.d6DateCAEVerified = new Date(this.d6StepDetails.d6DateCAEVerified);
      });
    }
  }

  /// Get All Attachments by Incident Id
  getAttachments() {
    if (this.incidentId > 0) {
      this.httpSvc.get<RestApiAttachments>(RestApi.get_attachments.format(this.incidentId, this.stepNo)).subscribe(data => {
        this.d6StepAttachment = data.contents;
        this.fileCount = this.d6StepAttachment.length;
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
          this.d6StepDetails.createdBy = JSON.parse(sessionStorage.getItem('userId'));
          this.httpSvc.delete(RestApi.delete_attachment.format(id, this.d6StepDetails.createdBy)).subscribe(
            res => {
              let status = '17';
              status += ("0" + res.status).slice(-2);
              this.messageService.add({ severity: ToastMessage[status].status, summary: ToastMessage[status].msg });
              if (res.status == 1) {
                this.aiLoggerSvc.AILogger(AILoggerPageName.D6,AILoggerAction.DELETE);
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
      this.d6StepDetails.createdBy = JSON.parse(sessionStorage.getItem('userId'));
      let input = new FormData();
      for (let file of event.files) {
        input.append("files", file);
      }

      this.httpSvc.post(this.uploadUrl.format(this.d6StepDetails.incidentId, this.stepNo, this.d6StepDetails.createdBy), input).subscribe(
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

  formIsDirty() {
    this.sidebarSvc.formStatus = true;
  }

  /// Submit D6 Step Details
  submit() {
    if (Number(sessionStorage.getItem('userId')) != null || Number(sessionStorage.getItem('currentRole')) != null) {
      this.d6StepDetails.modifiedBy = Number(sessionStorage.getItem('userId'));
      this.d6StepDetails.d6DateCAEVerified = this.datePipe.transform(this.d6StepDetails.d6DateCAEVerified, 'yyyy-MM-dd') as any;
      this.httpSvc.post(RestApi.save_d6_step, this.d6StepDetails).subscribe(
        res => {
          let status = '12';
          status += ("0" + res.status).slice(-2);
          this.messageService.add({ severity: ToastMessage[status].status, summary: ToastMessage[status].msg });
          if (res.status == 1) {
            this.aiLoggerSvc.AILogger(AILoggerPageName.D6,AILoggerAction.SAVE);
            this.sidebarSvc.formStatus = false;
            this.refreshInternal8D();
            this.refreshData();
          }
        });
    }
  }

  refreshData() {
    if (this.close != undefined) { this.close.nativeElement.click(); }
    this.getD6Details();
  }


  /// Edit Corrective Action
  editCorrectiveAction(incidentId: number, rowIndex: number) {
    this.selectedCorrectiveAction = rowIndex;
    this.httpSvc.get<RestApiData>(RestApi.lookup_master.format(EnumLookup.ROOT_CAUSE_SOURCE)).subscribe(data => {
      this.sourceLst = data.contents;
      this.sourceLst.push({ id: -1, lookupValue: 'Other' });
    });
    from<CorrectiveActions[]>(this.d6StepDetails.correctiveActions).pipe(find(x => x.id === incidentId)).subscribe(
      data => {
        this.correctiveAction = data;
        if (this.correctiveAction.d6DateImplemented) this.correctiveAction.d6DateImplemented = new Date(this.correctiveAction.d6DateImplemented);
        else this.correctiveAction.d6DateImplemented = null;
      });
  }

  /// Save Corrective Action
  saveCorrectiveAction() {
    this.correctiveAction.d6DateImplemented = this.datePipe.transform(this.correctiveAction.d6DateImplemented, 'yyyy-MM-dd') as any;
    this.correctiveActionsGrid.updateRow(this.correctiveAction, this.selectedCorrectiveAction);
    if (this.close != undefined) { this.close.nativeElement.click(); }
    this.correctiveAction = new CorrectiveActions();
    this.submit();
  }


  /// CA Verifier Search Event
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
    this.caVerifier.globalId = getglobalID;
    this.caVerifier.name = item.displayName;
    this.caVerifier.emailId = item.mail;
    this.caVerifier.incidentId = this.d6StepDetails.incidentId;
    this.caVerifier.dBaseId = this.d6StepDetails.id;
    this.caVerifier.modifiedBy = Number(sessionStorage.getItem('userId'));
    this.saveCAVerifiers();
  }

  /// Resets globalId, Name, Email Field
  inputClearSearch() {
    this.caVerifier = new CAVerifiers();
  }

  /// Save CA Verifiers
  saveCAVerifiers() {
    this.httpSvc.post(RestApi.save_ca_verifier, this.caVerifier).subscribe(
      res => {
        // let status = '16';
        // status += ("0" + res.status).slice(-2);
        // this.messageService.add({ severity: ToastMessage[status].status, summary: ToastMessage[status].msg });
        if (res.status == 1) {
          this.caVerifier = new CAVerifiers();
          this.submit();
        }
      });
  }

  /// Delete CA Verifier
  deleteCAVerifier(id: number) {
    this.confirmationService.confirm({
      message: ConfirmationMessage.DELETE,
      header: ConfirmationHeader.DELETE,
      icon: 'pi pi-info-circle',
      accept: () => {
        if (JSON.parse(sessionStorage.getItem('userId')) != null) {
          let modifiedBy = Number(sessionStorage.getItem('userId'));
          this.httpSvc.delete(RestApi.delete_ca_verifier.format(id, modifiedBy)).subscribe(
            res => {
              let status = '17';
              status += ("0" + res.status).slice(-2);
              this.messageService.add({ severity: ToastMessage[status].status, summary: ToastMessage[status].msg });
              if (res.status == 1) {
                this.getD6Details();
              }
            });
        }
      },
      reject: () => { }
    });
  }

}
