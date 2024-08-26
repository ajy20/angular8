import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Attachment, RestApiAttachments } from 'src/app/incident/shared/models/attachment';
import { Internal8DStep, RoleConstant, D4SubStep, FileUploadSize } from 'src/app/shared/class/constant';
import { StepD7, StepD7Api, CorrectiveActionFiveWhy, LookAcross } from '../shared/models/stepD7';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpService } from 'src/app/shared/services/http.service';
import { MessageService, ConfirmationService } from 'primeng/api';
import { SidebarService } from 'src/app/shared/services/sidebar.service';
import { RestApi } from 'src/app/shared/class/rest-api';
import { ConfirmationMessage, ConfirmationHeader, AILoggerPageName, AILoggerAction } from '../shared/models/enums';
import { ToastMessage, ToastMsg } from 'src/app/shared/class/toast-msg';
import { FiveWhy } from '../shared/models/stepD4';
import { MonitoringService } from 'src/app/shared/services/monitoring.service';

@Component({
  selector: 'app-d7-form',
  templateUrl: './d7-form.component.html',
  styleUrls: ['./d7-form.component.css']
})
export class D7FormComponent implements OnInit {

  @ViewChild('d7Form', { static: false }) d7Form: NgForm;
  @ViewChild('close', { static: false }) close: ElementRef;
  @ViewChild('productDesignView', { static: false }) productDesignView: ElementRef;
  @ViewChild('operationView', { static: false }) operationView: ElementRef;
  @ViewChild('qualityView', { static: false }) qualityView: ElementRef;
  @ViewChild('processOwnerView', { static: false }) processOwnerView: ElementRef;

  d7StepDetails: StepD7;
  incidentId: number;
  currentRole: number;
  currentUser: number;
  isEditable: boolean;
  d7StepAttachment: Attachment[];
  uploadedFiles: any[] = [];
  fileCount: number;
  uploadUrl: string;
  routeUrl: string;
  stepNo: number = Internal8DStep.d7Step;
  fiveWhy: FiveWhy;
  whyIndexD7 = -1;
  whyIndexStyle7: number;
  productDesignQnAView: boolean = false;
  operationQnAView: boolean = false;
  qualityQnAView: boolean = false;
  processOwnerQnAView: boolean = false;
  lookAcross: LookAcross;
  newLookAcrossId: number = 0;
  fileUploadSize: number = FileUploadSize.FILE_UPLOAD_SIZE;

  constructor(
    private router: Router,
    private httpSvc: HttpService,
    private messageService: MessageService,
    private sidebarSvc: SidebarService,
    private confirmationService: ConfirmationService,
    private aiLoggerSvc: MonitoringService
  ) {
    this.uploadUrl = RestApi.incident_attachment;
  }

  ngOnInit() {
    this.is8DFormEditable();
    this.sidebarSvc.internal8DTabChange('D7');
    this.refreshInternal8D();
    this.getD7Details();
    this.getAttachments();
    this.aiLoggerSvc.AILogger(AILoggerPageName.D7,AILoggerAction.VIEW);
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

  /// Get D7 Step Details
  getD7Details() {
    let baseUri = this.router.url;
    let uri = baseUri.split('/');
    this.incidentId = Number(uri[uri.length - 2]);

    if (this.incidentId > 0) {
      this.httpSvc.get<StepD7Api>(RestApi.get_d7_by_id.format(this.incidentId)).subscribe(data => {
        this.d7StepDetails = data.contents;
        this.verifyLookAcross();
      });
    }
  }

  /// Verify look across 
  verifyLookAcross() {
    let lookaccrosslength = this.d7StepDetails.lookAcross.length;
    if (lookaccrosslength < 5) {
      this.addLookAcross(lookaccrosslength);
    }
  }

  addLookAcross(lookAcrossLength: number) {
    this.lookAcross = {
      id: this.newLookAcrossId--,
      incidentId: this.d7StepDetails.incidentId,
      location: '',
      recommendedActions: ''
    }
    for (let i = lookAcrossLength; i < 5; i++) {
      this.d7StepDetails.lookAcross.push(this.lookAcross);
    }
    this.httpSvc.post(RestApi.save_d7_step, this.d7StepDetails).subscribe(res => {
      if (res.status == 1) { this.getD7Details(); }
    });
  }

  /// Occurance 5 Why
  addFiveWhy(fiveWayType: string) {
    this.fiveWhy = {
      id: 0,
      whyQuestion: '',
      incidentId: this.d7StepDetails.incidentId,
      dBaseId: this.d7StepDetails.id,
      subStepNumber: 1,
      stepNumber: Internal8DStep.d7Step
    }

    if (this.d7StepDetails.correctiveActionFiveWhy.filter((obj) => obj.subStepNumber === D4SubStep.occurence).length < 10) {
      this.d7StepDetails.correctiveActionFiveWhy.push(this.fiveWhy);
    }
  }

  /// Submit D6 Step Details
  submit() {
    if (Number(sessionStorage.getItem('userId')) != null || Number(sessionStorage.getItem('currentRole')) != null) {
      this.d7StepDetails.modifiedBy = Number(sessionStorage.getItem('userId'));
      this.httpSvc.post(RestApi.save_d7_step, this.d7StepDetails).subscribe(
        res => {
          let status = '12';
          status += ("0" + res.status).slice(-2);
          this.messageService.add({ severity: ToastMessage[status].status, summary: ToastMessage[status].msg });
          if (res.status == 1) {
            this.aiLoggerSvc.AILogger(AILoggerPageName.D7,AILoggerAction.SAVE);
            this.sidebarSvc.formStatus = false;
            this.refreshInternal8D();
            this.getD7Details();
          }
        });
    }
  }


  /// Get All Attachments by Incident Id
  getAttachments() {
    if (this.incidentId > 0) {
      this.httpSvc.get<RestApiAttachments>(RestApi.get_attachments.format(this.incidentId, this.stepNo)).subscribe(data => {
        this.d7StepAttachment = data.contents;
        this.fileCount = this.d7StepAttachment.length;
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
          this.d7StepDetails.createdBy = JSON.parse(sessionStorage.getItem('userId'));
          this.httpSvc.delete(RestApi.delete_attachment.format(id, this.d7StepDetails.createdBy)).subscribe(
            res => {
              let status = '17';
              status += ("0" + res.status).slice(-2);
              this.messageService.add({ severity: ToastMessage[status].status, summary: ToastMessage[status].msg });
              if (res.status == 1) {
                this.aiLoggerSvc.AILogger(AILoggerPageName.D7,AILoggerAction.DELETE);
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
      this.d7StepDetails.createdBy = JSON.parse(sessionStorage.getItem('userId'));
      let input = new FormData();
      for (let file of event.files) {
        input.append("files", file);
      }

      this.httpSvc.post(this.uploadUrl.format(this.d7StepDetails.incidentId, this.stepNo, this.d7StepDetails.createdBy), input).subscribe(
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

  productDesignArtifactsClick() {
    this.productDesignView.nativeElement.firstElementChild.className == 'fa fa-plus' ? this.productDesignView.nativeElement.firstElementChild.className = 'fa fa-minus' : this.productDesignView.nativeElement.firstElementChild.className = 'fa fa-plus';
    this.productDesignQnAView == true ? this.productDesignQnAView = false : this.productDesignQnAView = true;
  }

  operationArtifactsClick() {
    this.operationView.nativeElement.firstElementChild.className == 'fa fa-plus' ? this.operationView.nativeElement.firstElementChild.className = 'fa fa-minus' : this.operationView.nativeElement.firstElementChild.className = 'fa fa-plus';
    this.operationQnAView == true ? this.operationQnAView = false : this.operationQnAView = true;
  }
  qualityArtifactsClick() {
    this.qualityView.nativeElement.firstElementChild.className == 'fa fa-plus' ? this.qualityView.nativeElement.firstElementChild.className = 'fa fa-minus' : this.qualityView.nativeElement.firstElementChild.className = 'fa fa-plus';
    this.qualityQnAView == true ? this.qualityQnAView = false : this.qualityQnAView = true;
  }
  processOwnerArtifactsClick() {
    this.processOwnerView.nativeElement.firstElementChild.className == 'fa fa-plus' ? this.processOwnerView.nativeElement.firstElementChild.className = 'fa fa-minus' : this.processOwnerView.nativeElement.firstElementChild.className = 'fa fa-plus';
    this.processOwnerQnAView == true ? this.processOwnerQnAView = false : this.processOwnerQnAView = true;
  }
}
