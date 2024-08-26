import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { IncidentService } from '../shared/services/incident.service';
import { Incident } from '../shared/models/incident-details';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpService } from 'src/app/shared/services/http.service';
import { MessageService } from 'primeng/api';
import { RestApi } from 'src/app/shared/class/rest-api';
import { ToastMsg } from 'src/app/shared/class/toast-msg';
import { RestApiIncidentEditHistory, IncidentEditHistory } from '../shared/models/incident-edit-history';
import { RestApiAttachments, Attachment } from '../shared/models/attachment';
import { RoleConstant, EnumDecision, EnumStatus, EnumPageName } from 'src/app/shared/class/constant';
import { SidebarService } from 'src/app/shared/services/sidebar.service';
import { MonitoringService } from 'src/app/shared/services/monitoring.service';
import { AILoggerPageName, AILoggerAction } from 'src/app/internal8d-form/shared/models/enums';

@Component({
  selector: 'app-incident-form',
  templateUrl: './incident-form.component.html',
  styleUrls: ['./incident-form.component.css']
})
export class IncidentFormComponent implements OnInit {
  @ViewChild('close', { static: false }) close: ElementRef;
  @ViewChild('commentForm', { static: true }) form: any;

  incident: Incident;
  incidentId: number;
  showCommentModal: boolean = false;
  incidentEditHistory: IncidentEditHistory[];
  incidentAttachment: Attachment[];
  fileCount: number;
  toastMsgName: string = 'Incident Edit Reason';
  commentView: boolean = false;
  readonly pageUser: number = RoleConstant.user;
  readonly editIncidentDecisionVal: number = EnumDecision.editIncidentDecisionVal;
  readonly pageIncidentApprover: number = RoleConstant.incidentApprover;
  currentRole: number;
  editBtn: boolean;
  incidentNumber: string;
  pageName: string = EnumPageName.INCIDENT_DETAILS;

  constructor(
    private incidentSvc: IncidentService,
    private httpSvc: HttpService,
    private messageService: MessageService,
    private router: Router,
    private sidebarSvc: SidebarService,
    private route: ActivatedRoute,
    private aiLoggerSvc: MonitoringService
  ) { }

  ngOnInit() {
    this.checkRedirectUrl();
    this.getIncidentDetail();
    this.getReasonList();
    this.getAttachments();
    this.aiLoggerSvc.AILogger(AILoggerPageName.VIEW_INCIDENT,AILoggerAction.VIEW);
  }

  checkRedirectUrl() {
    this.sidebarSvc.filterChange(this.pageName);
    if (localStorage.getItem('redirectedURL')) {
      this.incidentSvc.incidentId = Number(this.route.snapshot.params.id);
    }
    this.sidebarSvc.clearRedirectUrl();
  }

  editBtnCheck() {
    this.editBtn = false;
    if (this.currentRole == this.pageUser) {
      if (this.incident.decisionId == EnumDecision.decisionVal && this.incident.statusId <= EnumStatus.statusVal) {
        this.editBtn = true;
      }
    }
  }


  viewComment() {
    this.commentView == true ? this.commentView = false : this.commentView = true;
  }

  /// Get Incident Detail by Incident Id
  getIncidentDetail() {
    this.currentRole = JSON.parse(sessionStorage.getItem('currentRole'));
    this.incidentSvc.getIncident().subscribe(data => {
      if (data.contents != null) {
        this.incident = data.contents;
        this.incidentNumber = this.incident.incidentNumber;
        this.editBtnCheck();
      } else {
        this.router.navigate(['/home']);
      }
    });
  }

  /// Get Incident Edit Reason
  getReasonList() {
    this.httpSvc.get<RestApiIncidentEditHistory>(RestApi.get_incident_edit_history.format(this.incidentSvc.incidentId)).subscribe(data => {
      this.incidentEditHistory = data.contents;
    });
  }

  /// Get All Attachments by Incident Id
  getAttachments() {
    let stepNumber = 0;
    this.httpSvc.get<RestApiAttachments>(RestApi.get_attachments.format(this.incidentSvc.incidentId, stepNumber)).subscribe(data => {
      this.incidentAttachment = data.contents;
      this.fileCount = this.incidentAttachment.length;
    });
  }


  /// Edit incident form depending upon status
  editIncidentForm() {
    if (this.incident.statusId == 1) {
      this.showCommentModal = true;
    } else {
      this.router.navigate(['/editIncidentform']);
    }
  }

  /// Save comment to edit Incident Form
  submit() {
    this.incidentId = this.incident.id;
    if (JSON.parse(sessionStorage.getItem('userId')) != null) {
      this.incident.createdBy = JSON.parse(sessionStorage.getItem('userId'));
      this.incident.createdByUsername = sessionStorage.getItem('LoggedUserGID');
      this.httpSvc.patch(RestApi.change_status.format(this.incident.id, 0, this.incident.createdBy, this.incident.editReason), '').subscribe(
        res => {
          this.messageService.add({ severity: ToastMsg.save[res.status].status, summary: ToastMsg.save[res.status].msg.format(this.toastMsgName) });
          if (res.status == 1) {
            this.refreshData();
          }
        });
    }
  }

  refreshData() {
    this.close.nativeElement.click();
    this.showCommentModal = false;
    this.incidentSvc.incidentId = this.incidentId;
    this.router.navigate(['/editIncidentform']);
  }

  view8dForm() {
    let incidentId = this.incidentSvc.incidentId;
    this.sidebarSvc.setIncidentId(incidentId, this.incidentNumber);
    this.sidebarSvc.internal8DTabChange('D1');
    this.router.navigateByUrl(`/internal8dform/${incidentId}/D1`);
  }

  localizeDateStr(date: Date) {
    return new Date(date.toString().replace('T', ' ') + ' UTC').toLocaleString();
  }

}
