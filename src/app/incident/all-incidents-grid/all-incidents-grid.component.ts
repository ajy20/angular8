import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { DashboardIncident } from 'src/app/models/dashboard-incident';
import { DataType, IgxColumnComponent, IgxGridComponent, IgxNumberFilteringOperand, IgxStringFilteringOperand } from "igniteui-angular";
import { Router, RouterEvent, NavigationEnd, ActivatedRoute } from '@angular/router';
import { from, Subject, Subscription } from 'rxjs';
import { find, filter, takeUntil } from 'rxjs/operators';
import { Master, RestApiData } from 'src/app/models/master';
import { RestApi } from 'src/app/shared/class/rest-api';
import { IncidentService } from '../shared/services/incident.service';
import { HttpService } from 'src/app/shared/services/http.service';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ToastMsg, ToastMessage } from 'src/app/shared/class/toast-msg';
import { SidebarService } from 'src/app/shared/services/sidebar.service';
import { RoleConstant, EnumDecision } from 'src/app/shared/class/constant';
import { AuthService } from 'src/app/shared/services/auth.service';
import { AILoggerPageName, AILoggerAction } from 'src/app/internal8d-form/shared/models/enums';
import { MonitoringService } from 'src/app/shared/services/monitoring.service';

@Component({
  selector: 'app-all-incidents-grid',
  templateUrl: './all-incidents-grid.component.html',
  styleUrls: ['./all-incidents-grid.component.css']
})

export class AllIncidentsGridComponent implements OnInit {
  @ViewChild("grid1", { read: IgxGridComponent, static: true })
  public grid1: IgxGridComponent;
  private _filterValues = new Map<IgxColumnComponent, any>();
  @ViewChild('close', { static: false }) close: ElementRef;
  @ViewChild('commentForm', { static: true }) form: any;
  showCommentModal: boolean = false;
  incidents: DashboardIncident[];
  incident: DashboardIncident;
  decisions: Master[];
  statuses: Master[];
  incidentId: number;
  pageName: string = 'Dashboard';
  readonly authRole: number = RoleConstant.user;
  readonly decisionVal: number = EnumDecision.decisionVal;
  readonly decisionBtnVal: number = EnumDecision.editIncidentDecisionVal;
  readonly pageIncidentApprover: number = RoleConstant.incidentApprover;
  currentRole: number;
  routeUrl: string;
  refreshSubs: Subscription;
  statusSubs: Subscription;
  decisionSubs: Subscription;
  incidentsSubs: Subscription;
  isAssignedToMe: boolean = false;

  public destroyed = new Subject<any>();
  @ViewChild('summaryLink', { static: false }) summaryLink: ElementRef<HTMLElement>;

  constructor(
    private httpSvc: HttpService,
    private router: Router,
    private authSvc: AuthService,
    private messageService: MessageService,
    private incidentSvc: IncidentService,
    private confirmationService: ConfirmationService,
    private sidebarSvc: SidebarService,
    private route: ActivatedRoute,
    private aiLoggerSvc: MonitoringService
  ) { }

  ngOnInit() {
    this.refreshUrlData();
    this.sidebar();
    this.getStatusDecision();
    this.getIncidents();
    this.aiLoggerSvc.AILogger(AILoggerPageName.ALL_INCIDENTS,AILoggerAction.VIEW);
  }

  /// Refresh link
  refreshUrlData() {
    this.refreshSubs = this.router.events.pipe(filter((event: RouterEvent) => event instanceof NavigationEnd), takeUntil(this.destroyed)).subscribe(() => {
      this.getIncidents();
    });
  }

  /// Set Selected Page Name in Sidebar
  sidebar() {
    this.sidebarSvc.clearRedirectUrl();
    this.sidebarSvc.filterChange(this.pageName);
  }

  /// Get Status & Decision
  getStatusDecision() {
    this.statusSubs = this.httpSvc.get<RestApiData>(RestApi.lookup_master.format('status')).subscribe(data => {
      this.statuses = data.contents;
    });
    this.decisionSubs = this.httpSvc.get<RestApiData>(RestApi.lookup_master.format('decision')).subscribe(data => {
      this.decisions = data.contents;
    });
  }

  /// Get Incidents
  getIncidents() {
    if (JSON.parse(sessionStorage.getItem('userId')) != null) {
      this.currentRole = JSON.parse(sessionStorage.getItem('currentRole'));
      let createdBy = JSON.parse(sessionStorage.getItem('userId'));
      this.incidentsSubs = this.httpSvc.get<DashboardIncidentAPIResponse>(RestApi.dashboard_incidents.format(createdBy, this.currentRole, this.isAssignedToMe)).subscribe(data => {
        this.incidents = data.contents;
      });
    }
  }

  /// View 8D Form
  view8DForm(rowIndex) {
    let incidentId = this.grid1.getCellByColumn(rowIndex, 'id').value;
    let incidentNumber;
    from<DashboardIncident[]>(this.incidents).pipe(find(x => x.id === incidentId)).subscribe(data => { incidentNumber = data.incidentNumber });
    this.sidebarSvc.setIncidentId(incidentId, incidentNumber);
    this.sidebarSvc.internal8DTabChange('D1');
    this.router.navigateByUrl(`/internal8dform/${incidentId}/D1`);
  }


  /// Add New Incident Button Click
  addIncident() {
    this.incidentSvc.incidentId = 0;
    this.router.navigate(['/editIncidentform']);
  }

  /// View Incident Details
  viewIncidentDetails(incidentNumber: string) {
    this.findIncdientId(incidentNumber).subscribe(data => {
      this.incidentSvc.incidentId = data.id;
    });
    this.router.navigate(['/incidentform']);
  }

  /// Return IncidentId from IncidentNumber
  findIncdientId(incidentNumber: string) {
    return from<DashboardIncident[]>(this.incidents).pipe(find(x => x.incidentNumber === incidentNumber));
  }

  /// Update Incident Decision
  onDecisionChange(event): void {
    let decisionId = event.currentTarget.value;
    this.findIncdientId(event.currentTarget.parentElement.parentElement.firstElementChild.innerText).subscribe(data => {
      this.incidentId = data.id;
    });
    this.confirmationService.confirm({
      message: 'Do you want to update decision?',
      header: 'Decision Update Confirmation',
      icon: 'pi pi-info-circle',
      accept: () => {
        if (JSON.parse(sessionStorage.getItem('userId')) != null) {
          let createBy = JSON.parse(sessionStorage.getItem('userId'));
          this.httpSvc.patch(RestApi.change_decision.format(this.incidentId, decisionId, createBy), '').subscribe(
            res => {
              let dashboardStatus = '11';
              dashboardStatus += ("0" + res.status).slice(-2);
              this.messageService.add({ severity: ToastMessage[dashboardStatus].status, summary: ToastMessage[dashboardStatus].msg });
              if (res.status == 1) {
                this.getStatusDecision();
                this.getIncidents();
              }
            });
        }
      },
      reject: () => {
        this.getStatusDecision();
        this.getIncidents();
      }
    });
  }

  /// Update Incident Status
  onStatusChange(event): void {
    let statusId = event.currentTarget.value;
    this.findIncdientId(event.currentTarget.parentElement.parentElement.firstElementChild.innerText).subscribe(data => {
      this.incidentId = data.id;
    });
    this.confirmationService.confirm({
      message: 'Do you want to update status?',
      header: 'Status Update Confirmation',
      icon: 'pi pi-info-circle',
      accept: () => {
        if (JSON.parse(sessionStorage.getItem('userId')) != null) {
          let createBy = JSON.parse(sessionStorage.getItem('userId'));
          this.httpSvc.patch(RestApi.change_status.format(this.incidentId, statusId, createBy, 0), '').subscribe(
            res => {
              let dashboardStatus = '10';
              dashboardStatus += ("0" + res.status).slice(-2);
              this.messageService.add({ severity: ToastMessage[dashboardStatus].status, summary: ToastMessage[dashboardStatus].msg });
              if (res.status == 1) {
                this.getStatusDecision();
                this.getIncidents();
              }
            });
        }
      },
      reject: () => {
        this.getStatusDecision();
        this.getIncidents();
      }
    });
  }


  /// View Incident Comment
  viewIncidentComment(incidentId: number) {
    this.showCommentModal = true;
    from<DashboardIncident[]>(this.incidents).pipe(find(x => x.id === incidentId)).subscribe(
      data => {
        this.incident = data;
      });
  }

  /// Save comment 
  submit() {
    if (JSON.parse(sessionStorage.getItem('userId')) != null) {
      let createBy = JSON.parse(sessionStorage.getItem('userId'));
      this.httpSvc.patch(RestApi.save_comment.format(this.incident.id, this.incident.comments, createBy), '').subscribe(
        res => {
          this.messageService.add({ severity: ToastMsg.save[res.status].status, summary: ToastMsg.save[res.status].msg.format('Comment') });
          if (res.status == 1) {
            this.refreshData();
          }
        });
    }
  }

  refreshData() {
    this.incident.comments = '';
    this.close.nativeElement.click();
    this.showCommentModal = false;
    this.getIncidents();
  }

  ///  Filter logic starts
  public getFilterValue(column: IgxColumnComponent): any {
    return this._filterValues.has(column) ? this._filterValues.get(column) : null;
  }

  public onInput(input: any, column: IgxColumnComponent) {
    this._filterValues.set(column, input.value);
    if (input.value === "") {
      this.grid1.clearFilter(column.field);
      return;
    }

    let operand = null;
    switch (column.dataType) {
      case DataType.Number:
        operand = IgxNumberFilteringOperand.instance().condition("equals");
        break;
      case DataType.String:
        operand = IgxStringFilteringOperand.instance().condition("contains");
        break;
      default:
        operand = IgxStringFilteringOperand.instance().condition("contains");
    }

    if (column.dataType == 'string') {
      this.grid1.filter(column.field, this.transformValue(input.value, column), operand, column.filteringIgnoreCase);
    } else {
      this.grid1.filter(column.field, this.transformText(input.value, column.field), operand, column.filteringIgnoreCase);
    }

  }

  public clearInput(column: IgxColumnComponent) {
    this._filterValues.delete(column);
    this.grid1.clearFilter(column.field);
  }

  private transformText(inputValue: string, column: string) {
    let id: number;
    if (column == 'decisionId') {
      let data = from<Master[]>(this.decisions).pipe(find(x => x.lookupValue.toLowerCase().includes(inputValue.toLowerCase())));
      data.subscribe(x => {
        id = x.id;
      });
      return id;
    } else {
      let data = from<Master[]>(this.statuses).pipe(find(x => x.lookupValue.toLowerCase().includes(inputValue.toLowerCase())));
      data.subscribe(x => {
        id = x.id;
      });
      return id;
    }
  }

  private transformValue(value: any, column: IgxColumnComponent): any {
    if (column.dataType === DataType.Number) {
      value = parseFloat(value);
    }
    return value;
  }
  ///  Filter logic ends


  ngOnDestroy(): void {
    if (this.refreshSubs) { this.refreshSubs.unsubscribe(); }
    if (this.decisionSubs) { this.decisionSubs.unsubscribe(); }
    if (this.statusSubs) { this.statusSubs.unsubscribe(); }
    if (this.incidentsSubs) { this.incidentsSubs.unsubscribe(); }
  }

}

export interface DashboardIncidentAPIResponse {
  status: boolean;
  contents: DashboardIncident[];
}
