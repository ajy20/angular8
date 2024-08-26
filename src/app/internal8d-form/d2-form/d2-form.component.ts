import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { StepD2, QuestionAnswer, StepD2Api } from '../shared/models/stepD2';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ToastMsg, ToastMessage } from 'src/app/shared/class/toast-msg';
import { HttpService } from 'src/app/shared/services/http.service';
import { RestApi } from 'src/app/shared/class/rest-api';
import { RestApiAttachments, Attachment } from 'src/app/incident/shared/models/attachment';
import { DatePipe } from '@angular/common';
import { Internal8DStep, RoleConstant, FileUploadSize } from 'src/app/shared/class/constant';
import { Calendar } from 'primeng/calendar';
import { SidebarService } from 'src/app/shared/services/sidebar.service';
import { ConfirmationMessage, ConfirmationHeader, AILoggerPageName, AILoggerAction } from '../shared/models/enums';
import { MonitoringService } from 'src/app/shared/services/monitoring.service';

@Component({
  selector: 'app-d2-form',
  templateUrl: './d2-form.component.html',
  styleUrls: ['./d2-form.component.css']
})
export class D2FormComponent implements OnInit {
  @ViewChild('d2Form', { static: false }) d2Form: NgForm;
  @ViewChild('fromCal', { static: false }) calendarFrom: Calendar;
  @ViewChild('whatView', { static: false }) whatView: ElementRef;
  @ViewChild('whereView', { static: false }) whereView: ElementRef;
  @ViewChild('whenView', { static: false }) whenView: ElementRef;
  @ViewChild('extentView', { static: false }) extentView: ElementRef;
  routeUrl: string;
  d2Step: StepD2;
  uploadUrl: string;
  stepNo: number = Internal8DStep.d2Step;
  d2StepAttachment: Attachment[];
  fileCount: number;
  incidentId: number;
  uploadedFiles: any[] = [];
  currentRole: number;
  isEditable: boolean;
  currentUser: number;
  whatQnAView: boolean = false;
  whereQnAView: boolean = false;
  whenQnAView: boolean = false;
  extentQnAView: boolean = false;
  fileUploadSize: number = FileUploadSize.FILE_UPLOAD_SIZE;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private datePipe: DatePipe,
    private messageService: MessageService,
    private httpSvc: HttpService,
    private sidebarSvc: SidebarService,
    private confirmationService: ConfirmationService,
    private aiLoggerSvc: MonitoringService
  ) {
    this.uploadUrl = RestApi.incident_attachment;
    this.d2Step = new StepD2();
  }

  ngOnInit() {
    this.is8DFormEditable();
    this.refreshInternal8D();
    this.getD2StepDetails();
    this.getAttachments();
    this.aiLoggerSvc.AILogger(AILoggerPageName.D2, AILoggerAction.VIEW);
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

  /// Get D2-Step Details
  getD2StepDetails() {
    this.incidentId = Number(this.route.snapshot.params.id);
    if (this.incidentId > 0) {
      this.httpSvc.get<StepD2Api>(RestApi.get_d2_by_id.format(this.incidentId)).subscribe(data => {
        this.d2Step = data.contents;
        this.d2Step.d2ComplaintDate = this.d2Step.d2ComplaintDate == null ? null : new Date(this.d2Step.d2ComplaintDate);
        this.d2Step.d2NonConfirmityCreatedDate = this.d2Step.d2NonConfirmityCreatedDate == null ? null : new Date(this.d2Step.d2NonConfirmityCreatedDate);
        this.d2Step.d2TargetClosureDate = this.d2Step.d2TargetClosureDate == null ? null : new Date(this.d2Step.d2TargetClosureDate);
      });
    }
  }

  /// Submit D2-Step
  submit() {
    if (JSON.parse(sessionStorage.getItem('userId')) != null || JSON.parse(sessionStorage.getItem('currentRole')) != null) {
      this.d2Step.modifiedBy = JSON.parse(sessionStorage.getItem('userId'));
      this.d2Step.currentRole = JSON.parse(sessionStorage.getItem('currentRole'));
      this.d2Step.d2ComplaintDate = this.datePipe.transform(this.d2Step.d2ComplaintDate, 'yyyy-MM-dd') as any;
      this.d2Step.d2NonConfirmityCreatedDate = this.datePipe.transform(this.d2Step.d2NonConfirmityCreatedDate, 'yyyy-MM-dd') as any;
      this.d2Step.d2TargetClosureDate = this.datePipe.transform(this.d2Step.d2TargetClosureDate, 'yyyy-MM-dd') as any;
      this.httpSvc.post(RestApi.save_d2_step, this.d2Step).subscribe(
        res => {
          let status = '12';
          status += ("0" + res.status).slice(-2);
          this.messageService.add({ severity: ToastMessage[status].status, summary: ToastMessage[status].msg });

          if (res.status == 1) {
            this.aiLoggerSvc.AILogger(AILoggerPageName.D2, AILoggerAction.SAVE);
            this.sidebarSvc.formStatus = false;
            this.refreshInternal8D();
            this.getD2StepDetails();
          }
        });
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

  /// Get All Attachments by Incident Id
  getAttachments() {
    if (this.d2Step.incidentId != 0) {
      this.httpSvc.get<RestApiAttachments>(RestApi.get_attachments.format(this.incidentId, this.stepNo)).subscribe(data => {
        this.d2StepAttachment = data.contents;
        this.fileCount = this.d2StepAttachment.length;
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
          this.d2Step.createdBy = JSON.parse(sessionStorage.getItem('userId'));
          this.httpSvc.delete(RestApi.delete_attachment.format(id, this.d2Step.createdBy)).subscribe(
            res => {
              let status = '17';
              status += ("0" + res.status).slice(-2);
              this.messageService.add({ severity: ToastMessage[status].status, summary: ToastMessage[status].msg });
              if (res.status == 1) {
                this.aiLoggerSvc.AILogger(AILoggerPageName.D2, AILoggerAction.DELETE);
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
      this.d2Step.createdBy = JSON.parse(sessionStorage.getItem('userId'));
      let input = new FormData();
      for (let file of event.files) {
        input.append("files", file);
      }

      this.httpSvc.post(this.uploadUrl.format(this.d2Step.incidentId, this.stepNo, this.d2Step.createdBy), input).subscribe(
        res => {
          this.messageService.add({ severity: ToastMsg.upload[res.status].status, summary: ToastMsg.upload[res.status].msg });
          form.clear();
          this.getAttachments();
        });
    }
  }
  /// File Upload End


  whatViewClick() {
    this.whatView.nativeElement.firstElementChild.className == 'fa fa-plus' ? this.whatView.nativeElement.firstElementChild.className = 'fa fa-minus' : this.whatView.nativeElement.firstElementChild.className = 'fa fa-plus';
    this.whatQnAView == true ? this.whatQnAView = false : this.whatQnAView = true;
  }

  whereViewClick() {
    this.whereView.nativeElement.firstElementChild.className == 'fa fa-plus' ? this.whereView.nativeElement.firstElementChild.className = 'fa fa-minus' : this.whereView.nativeElement.firstElementChild.className = 'fa fa-plus';
    this.whereQnAView == true ? this.whereQnAView = false : this.whereQnAView = true;
  }
  whenViewClick() {
    this.whenView.nativeElement.firstElementChild.className == 'fa fa-plus' ? this.whenView.nativeElement.firstElementChild.className = 'fa fa-minus' : this.whenView.nativeElement.firstElementChild.className = 'fa fa-plus';
    this.whenQnAView == true ? this.whenQnAView = false : this.whenQnAView = true;
  }
  extentViewClick() {
    this.extentView.nativeElement.firstElementChild.className == 'fa fa-plus' ? this.extentView.nativeElement.firstElementChild.className = 'fa fa-minus' : this.extentView.nativeElement.firstElementChild.className = 'fa fa-plus';
    this.extentQnAView == true ? this.extentQnAView = false : this.extentQnAView = true;
  }

}
