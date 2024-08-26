import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HttpService } from 'src/app/shared/services/http.service';
import { StepD4, StepD4Api, PotentialCause, FiveWhy } from '../shared/models/stepD4';
import { Router, ActivatedRoute } from '@angular/router';
import { RestApi } from 'src/app/shared/class/rest-api';
import { IgxGridComponent, IgxSelectComponent, OverlaySettings, IgxGridCellComponent } from 'igniteui-angular';
import { Master, RestApiData } from 'src/app/models/master';
import { Attachment, RestApiAttachments } from 'src/app/incident/shared/models/attachment';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Internal8DStep, D4SubStep, D4PotentialCause, EnumLookup, RoleConstant, FileUploadSize } from 'src/app/shared/class/constant';
import { ToastMsg, ToastMessage } from 'src/app/shared/class/toast-msg';
import { SidebarService } from 'src/app/shared/services/sidebar.service';
import { from } from 'rxjs';
import { find } from 'rxjs/operators';
import { ConfirmationMessage, ConfirmationHeader, AILoggerPageName, AILoggerAction } from '../shared/models/enums';
import { MonitoringService } from 'src/app/shared/services/monitoring.service';

@Component({
  selector: 'app-d4-form',
  templateUrl: './d4-form.component.html',
  styleUrls: ['./d4-form.component.css']
})
export class D4FormComponent implements OnInit {
  @ViewChild('d4Form', { static: false }) d4Form: NgForm;
  @ViewChild('close', { static: false }) close: ElementRef;
  @ViewChild("potentialCause", { read: IgxGridComponent, static: false })
  public potentialCause: IgxGridComponent;
  @ViewChild("subStep1", { read: IgxGridComponent, static: false }) public subStep1: IgxGridComponent;
  @ViewChild("subStep2", { read: IgxGridComponent, static: false }) public subStep2: IgxGridComponent;
  @ViewChild("subStep3", { read: IgxGridComponent, static: false }) public subStep3: IgxGridComponent;
  @ViewChild(IgxSelectComponent, { static: true })
  public igxSelect: IgxSelectComponent;
  public overlaySettings: OverlaySettings;

  potentialCauseModal: PotentialCause;
  potentialCauseModalType: string;
  currentIncident: PotentialCause;
  selectedPotentialCauseRow: number;

  d4StepDetails: StepD4;
  routeUrl: string;
  incidentId: number;
  summary: PotentialCause[];
  newSubStep: PotentialCause;
  typeLst: Master[];
  sourceLst: Master[];
  causeTypeLst: Master[];
  potentialCauseData: PotentialCause[];
  d4StepAttachment: Attachment[];
  uploadedFiles: any[] = [];
  fileCount: number;
  uploadUrl: string;
  stepNo: number = Internal8DStep.d4Step;
  fiveWhy: FiveWhy;
  whyIndexD4 = -1;
  whyIndexStyle4: number;
  selectedPotentialCause: number;
  currentRole: number;
  currentUser: number;
  isEditable: boolean;
  fileUploadSize: number = FileUploadSize.FILE_UPLOAD_SIZE;

  constructor(
    private router: Router,
    private httpSvc: HttpService,
    private messageService: MessageService,
    private sidebarSvc: SidebarService,
    private confirmationService: ConfirmationService,
    private route: ActivatedRoute,
    private aiLoggerSvc: MonitoringService
  ) {
    this.uploadUrl = RestApi.incident_attachment;
  }

  ngOnInit() {
    this.is8DFormEditable();
    this.refreshInternal8D();
    this.getD4Details();
    this.getD4OtherDetails();
    this.getAttachments();
    this.aiLoggerSvc.AILogger(AILoggerPageName.D4,AILoggerAction.VIEW);
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

  /// Get D4 Step Details
  getD4Details() {
    this.incidentId = Number(this.route.snapshot.params.id);
    if (this.incidentId > 0) {
      this.httpSvc.get<StepD4Api>(RestApi.get_d4_by_id.format(this.incidentId)).subscribe(data => {
        this.d4StepDetails = data.contents;
        this.summary = this.d4StepDetails.subStep1.concat(this.d4StepDetails.subStep2.concat(this.d4StepDetails.subStep3));
      });
    }
  }

  /// Get Problem Cause Grid Dropdown Values
  getD4OtherDetails() {
    this.httpSvc.get<RestApiData>(RestApi.lookup_master.format(EnumLookup.ROOT_CAUSE_TYPE)).subscribe(data => {
      this.typeLst = data.contents;
    });
    this.httpSvc.get<RestApiData>(RestApi.lookup_master.format(EnumLookup.ROOT_CAUSE_SOURCE)).subscribe(data => {
      this.sourceLst = data.contents;
      this.sourceLst.push({ id: -1, lookupValue: 'Other' });
    });
    this.httpSvc.get<RestApiData>(RestApi.lookup_master.format(EnumLookup.CAUSE_TYPE)).subscribe(data => {
      this.causeTypeLst = data.contents;
    });

  }

  /// Edit Potential Cause
  editPotentialCause(potentialCauseType: number, incidentId: number, rowIndex: number) {
    this.potentialCauseModalType = 'edit';
    this.selectedPotentialCauseRow = rowIndex;
    if (potentialCauseType == D4PotentialCause.investigation) {
      from<PotentialCause[]>(this.d4StepDetails.subStep1).pipe(find(x => x.id === incidentId)).subscribe(
        data => {
          this.currentIncident = data;
        });
    } else if (potentialCauseType == D4PotentialCause.occurrence) {
      from<PotentialCause[]>(this.d4StepDetails.subStep2).pipe(find(x => x.id === incidentId)).subscribe(
        data => {
          this.currentIncident = data;
        });
    } else {
      from<PotentialCause[]>(this.d4StepDetails.subStep3).pipe(find(x => x.id === incidentId)).subscribe(
        data => {
          this.currentIncident = data;
        });
    }
    this.potentialCauseModal = this.currentIncident;
  }

  /// Add Potential Cause 
  addPotentialCause(stepNumber: number) {
    this.selectedPotentialCause = stepNumber;
    this.potentialCauseModalType = 'add';
    this.potentialCauseModal = new PotentialCause();
    this.potentialCauseModal = {
      id: 0,
      incidentId: this.d4StepDetails.incidentId,
      dBaseId: this.d4StepDetails.id,
      typeId: 0,
      typeName: '',
      causeDescription: '',
      sourceId: 0,
      sourceName: '',
      sourceOther: '',
      causeTypeId: 0,
      causeTypeName: '',
      d4ExplainsIsOrIsNot: false,
      d4HowConfirmed: '',
      d4IsProbableRootCause: false,
      subStepNumber: this.selectedPotentialCause,
      additionalNotes: ''
    }
  }

  /// Close modal Potential Cause
  closeModal() {

    this.potentialCauseModal = new PotentialCause();
  }

  /// Save Potential Cause
  savePotentialCause() {
    if (this.potentialCauseModal.typeId != 0 || this.potentialCauseModal.causeDescription.length != 0 || this.potentialCauseModal.sourceId != 0 || this.potentialCauseModal.causeTypeId != 0 ||
      this.potentialCauseModal.d4HowConfirmed.length != 0 || this.potentialCauseModal.additionalNotes.length != 0) {
      switch (this.selectedPotentialCause) {
        case (1):
          if (this.potentialCauseModalType == 'add') {
            this.subStep1.addRow(this.potentialCauseModal);
          } else {
            this.subStep1.updateRow(this.potentialCauseModal, this.selectedPotentialCauseRow);
          }
          break;
        case (2):
          if (this.potentialCauseModalType == 'add') {
            this.subStep2.addRow(this.potentialCauseModal);
          } else {
            this.subStep2.updateRow(this.potentialCauseModal, this.selectedPotentialCauseRow);
          }
          break;
        case (3):
          if (this.potentialCauseModalType == 'add') {
            this.subStep3.addRow(this.potentialCauseModal);
          } else {
            this.subStep3.updateRow(this.potentialCauseModal, this.selectedPotentialCauseRow);
          }
          break;
        default:
          this.potentialCauseData = [];
          break;
      }
      this.close.nativeElement.click();
      this.potentialCauseModal = new PotentialCause();
      this.submitProblemCause();
    } else {
      this.close.nativeElement.click();
      this.potentialCauseModal = new PotentialCause();
    }

  }



  /// Submit Problem Cause for D4 Step
  submitProblemCause() {
    if (Number(sessionStorage.getItem('userId')) != null || Number(sessionStorage.getItem('currentRole')) != null) {
      this.d4StepDetails.modifiedBy = Number(sessionStorage.getItem('userId'));
      this.d4StepDetails.currentRole = Number(sessionStorage.getItem('currentRole'));
      this.httpSvc.post(RestApi.save_d4_step, this.d4StepDetails).subscribe(
        res => {
          let status = '12';
          status += ("0" + res.status).slice(-2);
          this.messageService.add({ severity: ToastMessage[status].status, summary: ToastMessage[status].msg });
          if (res.status == 1) {
            this.aiLoggerSvc.AILogger(AILoggerPageName.D4,AILoggerAction.SAVE);
            this.sidebarSvc.formStatus = false;
            this.refreshInternal8D();
            this.refreshData();
          }
        });
    }
  }

  /// Submit D4 Step Details
  submit() {
    this.submitProblemCause();
  }

  refreshData() {
    if (this.close != undefined) { this.close.nativeElement.click(); }
    this.getD4Details();
  }

  /// Get All Attachments by Incident Id
  getAttachments() {
    if (this.incidentId > 0) {
      this.httpSvc.get<RestApiAttachments>(RestApi.get_attachments.format(this.incidentId, this.stepNo)).subscribe(data => {
        this.d4StepAttachment = data.contents;
        this.fileCount = this.d4StepAttachment.length;
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
          this.d4StepDetails.createdBy = JSON.parse(sessionStorage.getItem('userId'));
          this.httpSvc.delete(RestApi.delete_attachment.format(id, this.d4StepDetails.createdBy)).subscribe(
            res => {
              let status = '17';
              status += ("0" + res.status).slice(-2);
              this.messageService.add({ severity: ToastMessage[status].status, summary: ToastMessage[status].msg });
              if (res.status == 1) {
                this.aiLoggerSvc.AILogger(AILoggerPageName.D4,AILoggerAction.DELETE);
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
      this.d4StepDetails.createdBy = JSON.parse(sessionStorage.getItem('userId'));
      let input = new FormData();
      for (let file of event.files) {
        input.append("files", file);
      }

      this.httpSvc.post(this.uploadUrl.format(this.d4StepDetails.incidentId, this.stepNo, this.d4StepDetails.createdBy), input).subscribe(
        res => {
          this.messageService.add({ severity: ToastMsg.upload[res.status].status, summary: ToastMsg.upload[res.status].msg });
          form.clear();
          this.getAttachments();
        });
    }
  }
  /// File Upload End

  /// Occurance 5 Why
  addFiveWhy(fiveWayType: string) {
    this.fiveWhy = {
      id: 0,
      whyQuestion: '',
      incidentId: this.d4StepDetails.incidentId,
      dBaseId: this.d4StepDetails.id,
      subStepNumber: (fiveWayType == 'occurence' ? D4SubStep.occurence : D4SubStep.detection),
      stepNumber: Internal8DStep.d4Step
    }

    if (fiveWayType == 'occurence' && this.d4StepDetails.occurenceFiveWhy.filter((obj) => obj.subStepNumber === D4SubStep.occurence).length < 10) {
      this.d4StepDetails.occurenceFiveWhy.push(this.fiveWhy);
    }

    if (fiveWayType == 'detection' && this.d4StepDetails.detectionFiveWhy.filter((obj) => obj.subStepNumber === D4SubStep.detection).length < 10) {
      this.d4StepDetails.detectionFiveWhy.push(this.fiveWhy);
    }
  }

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

}


