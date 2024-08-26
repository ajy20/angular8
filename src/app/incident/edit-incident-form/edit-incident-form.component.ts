import { Component, OnInit, ViewChild, ChangeDetectorRef, ElementRef } from '@angular/core';
import { Incident } from '../shared/models/incident-details';
import { HttpService } from 'src/app/shared/services/http.service';
import { Master, RoleMaster, RestApiData } from 'src/app/models/master';
import { RestApi } from 'src/app/shared/class/rest-api';
import { MessageService } from 'primeng/api';
import { ToastMsg, ToastMessage } from 'src/app/shared/class/toast-msg';
import { Router } from '@angular/router';
import { IncidentService } from '../shared/services/incident.service';
import { NgForm } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { AuthService } from 'src/app/shared/services/auth.service';
import { RestApiAttachments, Attachment } from '../shared/models/attachment';
import { IgxComboComponent } from 'igniteui-angular';
import { SidebarService } from 'src/app/shared/services/sidebar.service';
import { EnumPageName } from 'src/app/shared/class/constant';
import { AILoggerPageName, AILoggerAction } from 'src/app/internal8d-form/shared/models/enums';
import { MonitoringService } from 'src/app/shared/services/monitoring.service';

@Component({
  selector: 'app-edit-incident-form',
  templateUrl: './edit-incident-form.component.html',
  styleUrls: ['./edit-incident-form.component.css']
})
export class EditIncidentFormComponent implements OnInit {
  @ViewChild('incidentForm', { static: true }) incidentForm: NgForm;
  @ViewChild('templateComboProduct', { read: IgxComboComponent, static: false })
  public combo: IgxComboComponent;
  public get allSelectedProduct(): boolean {
    return this.combo ? this.combo.selectedItems().length === this.combo.data.length : false;
  }
  @ViewChild('templateComboTeam', { read: IgxComboComponent, static: false })
  public comboTeam: IgxComboComponent;
  public get allSelectedTeam(): boolean {
    return this.comboTeam ? this.comboTeam.selectedItems().length === this.comboTeam.data.length : false;
  }

  @ViewChild('close', { static: false }) close: ElementRef;
  @ViewChild('issueWhatForm', { static: true }) form: any;
  showWhatModal: boolean = false;
  incident: Incident;
  teams: Master[];
  systems: Master[];
  products: Master[];
  processes: Master[];
  processFunctions: Master[];
  selectedTeams: number[];
  selectedProduct: [];
  files: [];
  uploadUrl: string;
  uploadedFiles: any[] = [];
  incidentAttachment: Attachment[];
  fileCount: number;
  toastMsgName: string = 'Incident';
  productOther: boolean = false;
  attachmentStatus: boolean;
  pageName: string = EnumPageName.EDIT_INCIDENT_DETAILS;

  constructor(
    private httpSvc: HttpService,
    public auth: AuthService,
    private messageService: MessageService,
    private incidentSvc: IncidentService,
    private router: Router,
    private datePipe: DatePipe,
    public cdr: ChangeDetectorRef,
    private sidebarSvc: SidebarService,
    private aiLoggerSvc: MonitoringService
  ) {
    this.incident = new Incident();
    this.uploadUrl = RestApi.incident_attachment;
  }

  ngOnInit() {
    this.sidebar();
    this.getTeams();
    this.getSystems();
    this.getProducts();
    this.getProcesses();
    this.formType();
    this.getProcessFunctions();
    this.getAttachments();
    this.aiLoggerSvc.AILogger(AILoggerPageName.EDIT_INCIDENT,AILoggerAction.VIEW);
  }

  /// Set Selected Page Name in Sidebar
  sidebar() {
    this.sidebarSvc.clearRedirectUrl();
    this.sidebarSvc.filterChange(this.pageName);
  }


  public handleSelectProduct() {
    if (this.allSelectedProduct) {
      this.combo.deselectAllItems();
    } else {
      this.combo.selectAllItems();
    }
  }

  public handleSelectTeam() {
    if (this.allSelectedTeam) {
      this.comboTeam.deselectAllItems();
    } else {
      this.comboTeam.selectAllItems();
    }
  }

  viewIncidentWhat() {
    this.showWhatModal = true;
  }

  /// Function to decide New Incident Form or Edit Incident Form
  formType() {
    if (this.incidentSvc.incidentId == 0) {
      this.resetForm();
      this.attachmentStatus = true;
    } else {
      this.attachmentStatus = false;
      this.getIncidentData();

    }
  }

  /// Get All Attachments by Incident Id
  getAttachments() {
    if (this.incidentSvc.incidentId != 0) {
      let stepNumber = 0;
      this.httpSvc.get<RestApiAttachments>(RestApi.get_attachments.format(this.incidentSvc.incidentId, stepNumber)).subscribe(data => {
        this.incidentAttachment = data.contents;
        this.fileCount = this.incidentAttachment.length;
      });
    }
  }

  deleteAttachment(id: number) {
    if (JSON.parse(sessionStorage.getItem('userId')) != null) {
      this.incident.createdBy = JSON.parse(sessionStorage.getItem('userId'));
      this.httpSvc.delete(RestApi.delete_attachment.format(id, this.incident.createdBy)).subscribe(
        res => {
          this.messageService.add({ severity: ToastMsg.delete[res.status].status, summary: ToastMsg.delete[res.status].msg.format('Attachment') });
          if (res.status == 1) {
            this.aiLoggerSvc.AILogger(AILoggerPageName.EDIT_INCIDENT,AILoggerAction.DELETE);
            this.getAttachments();
          }
        });
    }
  }

  /// Get incident
  getIncidentData() {
    this.incidentSvc.getIncident().subscribe(
      data => {
        this.incident = data.contents;
        this.selectedTeams = this.incident.affectedTeams as [];
        this.selectedProduct = this.incident.productIds as [];
        this.incident.issueWhen = this.incident.issueWhen == null ? null : new Date(this.incident.issueWhen);
      });
  }

  /// Get Systems
  getSystems() {
    this.httpSvc.get<RestApiData>(RestApi.lookup_master.format('system')).subscribe(
      data => {
        this.systems = data.contents;
        this.systems.splice(0, 0, { id: 0, lookupValue: 'Select System' });
        this.systems.push({ id: -1, lookupValue: 'Other' });
      });
  }

  /// Get Products
  getProducts() {
    this.httpSvc.get<RestApiData>(RestApi.get_products_by_incident_id.format(this.incidentSvc.incidentId)).subscribe(
      data => {
        this.products = data.contents;
      });
  }

  /// Get Processes
  getProcesses() {
    this.httpSvc.get<RestApiData>(RestApi.processes).subscribe(
      data => {
        this.processes = data.contents;
        this.processes.splice(0, 0, { id: 0, name: 'Select Process' });
        this.processes.push({ id: -1, name: 'Other' });
      });
  }

  /// Get Process Functions
  getProcessFunctions() {
    this.httpSvc.get<RestApiData>(RestApi.process_functions).subscribe(
      data => {
        this.processFunctions = data.contents;
        this.processFunctions.splice(0, 0, { id: 0, name: 'Select Process Function' });
        this.processFunctions.push({ id: -1, name: 'Other' });
      });
  }

  /// Get Teams
  getTeams() {
    this.httpSvc.get<RoleMaster>(RestApi.get_teams_by_incident_id.format(this.incidentSvc.incidentId)).subscribe(
      teamData => {
        this.teams = teamData.contents;
      });
  }

  changeStatus(id: number) {
    this.httpSvc.patch(RestApi.change_status.format(id, 1, this.incident.createdBy, 'edit'), '').subscribe(
      res => {
        let status = '15';
        status += ("0" + res.status).slice(-2);
        this.messageService.add({ severity: ToastMessage[status].status, summary: ToastMessage[status].msg });
        if (res.status == 1) {
          this.refreshData();
        }
      });
  }

  /// Save for later incident
  submit() {
    this.validateData();
    if (JSON.parse(sessionStorage.getItem('userId')) != null) {
      this.incident.modifiedBy = this.incident.createdBy = JSON.parse(sessionStorage.getItem('userId'));
      this.incident.createdByUsername = sessionStorage.getItem('LoggedUserGID');
      this.incident.issueWhen = this.datePipe.transform(this.incident.issueWhen, 'yyyy-MM-dd') as any;
      this.httpSvc.post(RestApi.save_incident, this.incident).subscribe(
        res => {
          // this.messageService.add({ severity: ToastMsg.save[res.status].status, summary: ToastMsg.save[res.status].msg.format(this.toastMsgName) });
          let status = '14';
          status += ("0" + res.status).slice(-2);
          this.messageService.add({ severity: ToastMessage[status].status, summary: ToastMessage[status].msg });
          if (res.status == 1) {
            this.aiLoggerSvc.AILogger(AILoggerPageName.EDIT_INCIDENT,AILoggerAction.SAVE);
            this.refreshData();
          }
        });
    }
  }

  /// Final Submit Incident
  submitIncident() {
    this.validateData();
    if (JSON.parse(sessionStorage.getItem('userId')) != null) {
      this.incident.modifiedBy = this.incident.createdBy = JSON.parse(sessionStorage.getItem('userId'));
      this.incident.createdByUsername = sessionStorage.getItem('LoggedUserGID');
      this.incident.issueWhen = this.datePipe.transform(this.incident.issueWhen, 'yyyy-MM-dd') as any;
      this.httpSvc.post(RestApi.save_incident, this.incident).subscribe(
        res => {
          let status = '15';
          status += ("0" + res.status).slice(-2);
          this.aiLoggerSvc.AILogger(AILoggerPageName.EDIT_INCIDENT,AILoggerAction.SAVE);
          if (res.status == 1) {
            this.changeStatus(res.contents);
          } else {
            this.messageService.add({ severity: ToastMessage[status].status, summary: ToastMessage[status].msg });
          }
        });
    }
  }

  refreshData() {
    this.resetForm();
    this.router.navigate(['/home']);
  }

  resetForm() {
    this.incident.incidentNumber = '';
    this.incident.processOther = '';
    this.incident.processFunctionOther = '';
    this.incident.productOther = '';
    this.incident.systemOther = '';
    this.incident.issueWhat = '';
    this.incident.issueWhere = '';
    this.incident.issueHowMany = '';
    this.incident.additionalInfo = '';
    this.incident.comments = '';
    this.incident.statusChangeDate = new Date();
    this.incident.issueWhen = null;
    this.incident.affectedTeams = [];
    this.incident.productIds = [];
    this.incident.affectedTeamOther = '';
    this.incident.createdBy = 0;
    this.incident.createdByUsername = '';
    this.incident.modifiedBy = 0;
    this.incident.id = this.incident.processId = this.incident.processFunctionId = this.incident.systemId = this.incident.decisionId = this.incident.statusId = 0;
  }

  validateData() {
    this.incident.affectedTeams = this.selectedTeams as [];
    this.incident.productIds = this.selectedProduct;
    if (this.incident.processId != -1) { this.incident.processOther == null }
    if (this.incident.processFunctionId != -1) { this.incident.processFunctionOther == null }
    if (this.incident.systemId != -1) { this.incident.systemOther == null }
  }



  /// File Upload Start
  myUploader(event, form): void {
    if (event.files.length == 0) {
      return;
    }
    if (JSON.parse(sessionStorage.getItem('userId')) != null) {
      this.incident.createdBy = JSON.parse(sessionStorage.getItem('userId'));
      let input = new FormData();
      for (let file of event.files) {
        input.append("files", file);
      }

      this.httpSvc.post(this.uploadUrl.format(this.incident.id, 0, this.incident.createdBy), input).subscribe(
        res => {
          this.messageService.add({ severity: ToastMsg.upload[res.status].status, summary: ToastMsg.upload[res.status].msg });
          form.clear();
          this.getAttachments();
        });
    }
  }
  /// File Upload End


}


