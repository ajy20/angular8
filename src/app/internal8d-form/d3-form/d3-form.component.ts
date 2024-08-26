import { Component, OnInit, ViewChild, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { HttpService } from 'src/app/shared/services/http.service';
import { RestApi } from 'src/app/shared/class/rest-api';
import { ActivatedRoute, Router } from '@angular/router';
import { ContainmentActionType, Step, ConfirmationMessage, ConfirmationHeader, AILoggerPageName, AILoggerAction } from '../shared/models/enums';
import { ContainmentAction, ContainmentResult, D3Model, RestApiD3Model } from '../shared/models/D3Model';
import { NgForm } from '@angular/forms';
import { ToastMessage, ToastMsg } from 'src/app/shared/class/toast-msg';
import { MessageService, ConfirmationService } from 'primeng/api';
import { RestApiAttachments } from 'src/app/incident/shared/models/attachment';
import { IgxGridComponent, IgxGridCellComponent, OverlaySettings, IgxSelectComponent, IgxDialogComponent } from 'igniteui-angular';
import { DatePipe } from '@angular/common';
import { SidebarService } from 'src/app/shared/services/sidebar.service';
import { RoleConstant, FileUploadSize } from 'src/app/shared/class/constant';
import { MonitoringService } from 'src/app/shared/services/monitoring.service';

@Component({
  selector: 'app-d3-form',
  templateUrl: './d3-form.component.html',
  styleUrls: ['./d3-form.component.css']
})
export class D3FormComponent implements OnInit {
  @ViewChild('d3Form', { static: false })
  public d3Form: NgForm;

  @ViewChildren('gridSTContainmentResult', { read: IgxGridComponent })
  public lstShortTermGridContainmentResult: QueryList<IgxGridComponent>;

  @ViewChildren('gridLTContainmentResult', { read: IgxGridComponent })
  public lstLongTermGridContainmentResult: QueryList<IgxGridComponent>;

  @ViewChild('gridModal', { read: IgxGridComponent, static: false })
  public gridModal: IgxGridComponent;
  @ViewChild(IgxSelectComponent, { static: true })
  public igxSelect: IgxSelectComponent;
  public overlaySettings: OverlaySettings;

  @ViewChild('close', { static: false }) close: ElementRef;
  @ViewChild('containmentResultForm', { static: true }) containmentResultForm: any;

  containmentResult: ContainmentResult;
  selectedContainmentResult: number;
  containmentResultType: number;
  modalType: string = '';


  incidentId: number;
  currentUserId: number;
  currentRoleId: number;
  shortTermActionType: ContainmentActionType;
  longTermActionType: ContainmentActionType;
  data: D3Model;
  containmentResultsModalData: ContainmentResult[];
  containmentResultsModalDataTarget: number;
  containmentResultsModalDataActionIndex: number;
  containmentResultsModalDataActionId: number;
  fileCount: number;
  isEditable: boolean;
  newContainmentActionId: number = 0;
  newContainmentResultId: number = 0;
  newContainmentResults: ContainmentResult[];
  routeUrl: string;
  uploadedFiles: any[] = [];
  currentRole: number;
  currentUser: number;
  fileUploadSize: number = FileUploadSize.FILE_UPLOAD_SIZE;

  constructor(
    private route: ActivatedRoute,
    private httpSvc: HttpService,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private datePipe: DatePipe,
    private sidebarSvc: SidebarService,
    private aiLoggerSvc: MonitoringService
  ) {
    this.shortTermActionType = ContainmentActionType.SHORT_TERM;
    this.longTermActionType = ContainmentActionType.LONG_TERM;
    this.data = new D3Model();
    this.containmentResultsModalData = [];
  }

  ngOnInit() {
    this.is8DFormEditable();
    this.sidebarSvc.internal8DTabChange('D3');
    this.refreshInternal8D();
    this.incidentId = Number(this.route.snapshot.params.id);
    this.currentUserId = JSON.parse(sessionStorage.getItem('userId'));
    this.currentRoleId = JSON.parse(sessionStorage.getItem('currentRole'));
    this.getData();
    this.aiLoggerSvc.AILogger(AILoggerPageName.D3,AILoggerAction.VIEW);
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

  getData() {
    this.httpSvc.get<RestApiD3Model>(RestApi.get_d3.format(this.incidentId)).subscribe(result => {
      this.data = result.contents;
      if (this.data.certifiedMaterialBuildDate) this.data.certifiedMaterialBuildDate = new Date(this.data.certifiedMaterialBuildDate);
      else this.data.certifiedMaterialBuildDate = null;

      this.data.shortTermContainmentActions.forEach(result => {
        if (result.listCleanPointInfoDate) result.listCleanPointInfoDate = new Date(result.listCleanPointInfoDate);
        else result.listCleanPointInfoDate = null;
      })
      this.data.longTermContainmentActions.forEach(result => {
        if (result.listCleanPointInfoDate) result.listCleanPointInfoDate = new Date(result.listCleanPointInfoDate);
        else result.listCleanPointInfoDate = null;
      })
      this.containmentResultsModalData = [];
      this.newContainmentResults = [];
    });
  }

  /// Save Containment Result (Short TCA / Long TCA) Modal Event
  saveContainmentResult() {
    /// Add Containment Result
    if (this.modalType == 'add') {
      this.addContainmentType();
    }
    /// Edit Containment Result
    else {
      this.editContainmentType();
    }
    this.close.nativeElement.click();
    this.containmentResult = new ContainmentResult();
    this.formIsDirty();
  }

  /// Transform Date before save/update
  transformDate() {
    this.containmentResult.startDate = this.datePipe.transform(this.containmentResult.startDate, 'yyyy-MM-dd') as any;
    this.containmentResult.endDate = this.datePipe.transform(this.containmentResult.endDate, 'yyyy-MM-dd') as any;
  }

  /// Add Containment Type
  addContainmentType() {
    /// Short Term Containment Result
    if (this.containmentResult.sortLocation != 0 || this.containmentResult.startDate != null
      || this.containmentResult.endDate != null || this.containmentResult.sorted != null || this.containmentResult.good != null ||
      this.containmentResult.bad != null || this.containmentResult.scrapped != null || this.containmentResult.reworked != null || this.containmentResult.hours != null ||
      this.containmentResult.total != null) {
      if (this.containmentResultType == ContainmentActionType.SHORT_TERM) {
        this.transformDate();
        this.lstShortTermGridContainmentResult.toArray()[this.containmentResultsModalDataActionIndex].addRow(this.containmentResult);
      }
      /// Long Term Containment Result
      else {
        this.transformDate();
        this.lstLongTermGridContainmentResult.toArray()[this.containmentResultsModalDataActionIndex].addRow(this.containmentResult);
      }
    }
  }

  /// Edit Containment Type
  editContainmentType() {
    /// Short Term Containment Result
    if (this.containmentResultType == ContainmentActionType.SHORT_TERM) {
      this.transformDate();
      this.lstShortTermGridContainmentResult.toArray()[this.containmentResultsModalDataActionIndex].updateRow(this.containmentResult, this.selectedContainmentResult);
    }
    /// Long Term Containment Result
    else {
      this.transformDate();
      this.lstLongTermGridContainmentResult.toArray()[this.containmentResultsModalDataActionIndex].updateRow(this.containmentResult, this.selectedContainmentResult);
    }
  }

  /// Add Containtment Result
  addShortTermContResult(type: string, target: number, index: number, actionId: number) {
    this.modalType = type;
    this.containmentResultType = target;
    this.containmentResultsModalDataActionIndex = index;
    this.containmentResultsModalDataActionId = actionId;
    this.containmentResult = new ContainmentResult();
    this.containmentResult.id = this.newContainmentResultId--;
    this.containmentResult.incidentId = this.incidentId;
    this.containmentResult.dBaseId = this.data.dBaseId;
    this.containmentResult.containmentActionId = this.containmentResultsModalDataActionId;
    this.containmentResult.sortLocation = 0;
    this.containmentResult.startDate;
    this.containmentResult.endDate;
  }

  /// Edit Containment Result
  editContainmentAction(rowIndex: number, target: number, index: number, actionId: number) {
    this.modalType = '';
    this.selectedContainmentResult = rowIndex;
    this.containmentResultType = target;
    this.containmentResultsModalDataActionIndex = index;
    this.containmentResultsModalDataActionId = actionId;
    if (this.containmentResultType == ContainmentActionType.SHORT_TERM) {
      this.containmentResult = this.lstShortTermGridContainmentResult.toArray()[this.containmentResultsModalDataActionIndex].getRowByIndex(rowIndex).rowData;
    } else {
      this.containmentResult = this.lstLongTermGridContainmentResult.toArray()[this.containmentResultsModalDataActionIndex].getRowByIndex(rowIndex).rowData;
    }

    if (this.containmentResult.startDate) { this.containmentResult.startDate = new Date(this.containmentResult.startDate); }
    else this.containmentResult.startDate = null;
    
    if (this.containmentResult.endDate) { this.containmentResult.endDate = new Date(this.containmentResult.endDate); }
    else this.containmentResult.endDate = null;
  }

  /// Add Containment Action
  addNewContainmentAction(target) {
    let containmentAction = this.getNewContainmentAction(target);
    if (target === ContainmentActionType.SHORT_TERM) {
      this.data.shortTermContainmentActions.push(containmentAction);
    }
    else if (target === ContainmentActionType.LONG_TERM) {
      this.data.longTermContainmentActions.push(containmentAction);
    }

    this.formIsDirty();
  }

  /// Get Containment Action Type
  getNewContainmentAction(target) {
    let action = {
      id: this.newContainmentActionId--,
      actionType: target,
      containmentResults: []
    } as ContainmentAction;
    return action;
  }

  /// Containment Action Expand/Collapse
  expandCollapse(i: number, event) {
    event.currentTarget.firstElementChild.className == 'fa fa-plus' ? event.currentTarget.firstElementChild.className = 'fa fa-minus' : event.currentTarget.firstElementChild.className = 'fa fa-plus';
  }

  /// Upload Attachment
  myUploader(event, form): void {
    if (event.files.length == 0) {
      return;
    }
    if (JSON.parse(sessionStorage.getItem('userId')) != null) {
      let input = new FormData();
      for (let file of event.files) {
        input.append("files", file);
      }
      this.httpSvc.post(RestApi.incident_attachment.format(this.incidentId, Step.D3, this.currentUserId), input).subscribe(
        res => {
          this.messageService.add({ severity: ToastMsg.upload[res.status].status, summary: ToastMsg.upload[res.status].msg });
          form.clear();
          this.getAttachments();
        });
    }
  }

  /// Get All Attachments by Incident Id
  getAttachments() {
    if (this.incidentId != 0) {
      this.httpSvc.get<RestApiAttachments>(RestApi.get_attachments.format(this.incidentId, Step.D3)).subscribe(data => {
        this.data.attachments = data.contents;
        this.fileCount = this.data.attachments.length;
      });
    }
  }

  /// Delete Attachment
  deleteAttachment(id) {
    this.confirmationService.confirm({
      message: ConfirmationMessage.DELETE,
      header: ConfirmationHeader.DELETE,
      icon: 'pi pi-info-circle',
      accept: () => {
        if (id > 0) {
          this.httpSvc.delete(RestApi.delete_attachment.format(id, this.currentUserId)).subscribe(
            res => {
              let status = '17';
              status += ("0" + res.status).slice(-2);
              this.messageService.add({ severity: ToastMessage[status].status, summary: ToastMessage[status].msg });
              this.aiLoggerSvc.AILogger(AILoggerPageName.D3,AILoggerAction.DELETE);
              this.getData();
            });
        }
      },
      reject: () => { }
    });
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

  /// Submit D3 Step
  submit() {
    this.data.createdBy = this.currentUserId;
    // Transform all dates to avoid -1 day
    this.data.certifiedMaterialBuildDate = this.data.certifiedMaterialBuildDate == null ? null : this.datePipe.transform(this.data.certifiedMaterialBuildDate) as any;
    this.data.shortTermContainmentActions.forEach(action => {
      action.listCleanPointInfoDate = action.listCleanPointInfoDate == null ? null : this.datePipe.transform(action.listCleanPointInfoDate.toLocaleDateString(), 'yyyy-MM-dd') as any;
    });
    this.data.longTermContainmentActions.forEach(action => {
      action.listCleanPointInfoDate = action.listCleanPointInfoDate == null ? null : this.datePipe.transform(action.listCleanPointInfoDate.toLocaleDateString(), 'yyyy-MM-dd') as any;
    });

    // Call API to save data
    this.httpSvc.post(RestApi.save_d3, this.data).subscribe(
      res => {
        let d3SaveStatus = '12';
        d3SaveStatus += ("0" + res.status).slice(-2);
        this.messageService.add({ severity: ToastMessage[d3SaveStatus].status, summary: ToastMessage[d3SaveStatus].msg });
        this.sidebarSvc.formStatus = false;
        this.aiLoggerSvc.AILogger(AILoggerPageName.D3,AILoggerAction.SAVE);
        this.refreshInternal8D();
        this.getData();
      });
  }









  //// Old COde start //////////////

  addNewContainmentResult() {
    let result = {
      id: this.newContainmentResultId--,
      incidentId: this.incidentId,
      dBaseId: this.data.dBaseId,
      containmentActionId: this.containmentResultsModalDataActionId,
      sortLocation: null,
      sortLocationName: null,
      locationDetails: null,
      startDate: new Date("2003-03-17"),
      endDate: null,
      sorted: null,
      good: null,
      bad: null,
      scrapped: null,
      reworked: null,
      hours: null,
      total: null,
      responsibility: null
    } as ContainmentResult

    this.newContainmentResults.push(result);
    this.gridModal.addRow(result);
  }

  openContainmentResultsModal(target, index, actionId) {
    this.containmentResultsModalData = [];
    this.newContainmentResults = [];


    if (target === ContainmentActionType.SHORT_TERM) {
      let currentResults = this.data.shortTermContainmentActions[index].containmentResults;
      if (currentResults != undefined || currentResults != null)
        this.containmentResultsModalData = this.containmentResultsModalData.concat(this.data.shortTermContainmentActions[index].containmentResults);
    }
    else if (target === ContainmentActionType.LONG_TERM) {
      let currentResults = this.data.longTermContainmentActions[index].containmentResults;
      if (currentResults != undefined || currentResults != null)
        this.containmentResultsModalData = this.containmentResultsModalData.concat(this.data.longTermContainmentActions[index].containmentResults);
    }

    if (this.containmentResultsModalData === undefined || this.containmentResultsModalData === null)
      this.containmentResultsModalData = [];

    this.containmentResultsModalDataTarget = target;
    this.containmentResultsModalDataActionIndex = index;
    this.containmentResultsModalDataActionId = actionId;
  }

  closeContainmentResultsModal() {
    if (this.containmentResultsModalDataTarget === ContainmentActionType.SHORT_TERM) {
      this.newContainmentResults.forEach(result => {
        this.lstShortTermGridContainmentResult.toArray()[this.containmentResultsModalDataActionIndex].addRow(result);
      });

      let currentResults = this.data.shortTermContainmentActions[this.containmentResultsModalDataActionIndex].containmentResults;
      if (currentResults == undefined || currentResults == null)
        this.data.shortTermContainmentActions[this.containmentResultsModalDataActionIndex].containmentResults = [];

      this.data.shortTermContainmentActions[this.containmentResultsModalDataActionIndex].containmentResults = this.lstShortTermGridContainmentResult.toArray()[this.containmentResultsModalDataActionIndex].data;

    }
    else if (this.containmentResultsModalDataTarget === ContainmentActionType.LONG_TERM) {
      this.newContainmentResults.forEach(result => {
        this.lstLongTermGridContainmentResult.toArray()[this.containmentResultsModalDataActionIndex].addRow(result);
      });

      let currentResults = this.data.longTermContainmentActions[this.containmentResultsModalDataActionIndex].containmentResults;
      if (currentResults == undefined || currentResults == null)
        this.data.longTermContainmentActions[this.containmentResultsModalDataActionIndex].containmentResults = [];

      this.data.longTermContainmentActions[this.containmentResultsModalDataActionIndex].containmentResults = this.lstLongTermGridContainmentResult.toArray()[this.containmentResultsModalDataActionIndex].data;
    }
    this.newContainmentResults = [];
    this.containmentResultsModalData = [];
  }

  // Update Type Dropdown after selection
  public selectSortLocation(args, cell: IgxGridCellComponent) {
    cell.update(args.newSelection.value);
  }

  public getSortLocationName(id): string {
    let lookup = this.data.sortLocations.find(p => p.id === id);
    return lookup == undefined ? '' : lookup.lookupValue;
  }

  /////   Old Code End   //////////////


}
