import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { DataType, IgxColumnComponent, IgxGridComponent, IgxNumberFilteringOperand, IgxStringFilteringOperand } from "igniteui-angular";
import { HttpService } from 'src/app/shared/services/http.service';
import { MessageService, ConfirmationService } from 'primeng/api';
import { RestApi } from 'src/app/shared/class/rest-api';
import { ToastMsg } from 'src/app/shared/class/toast-msg';
import { Master, Masters } from 'src/app/models/master';
import { SidebarService } from 'src/app/shared/services/sidebar.service';
import { MonitoringService } from 'src/app/shared/services/monitoring.service';
import { AILoggerPageName, AILoggerAction } from 'src/app/internal8d-form/shared/models/enums';

@Component({
  selector: 'app-teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.css']
})
export class TeamsComponent implements OnInit {
  @ViewChild("grid1", { read: IgxGridComponent, static: true })
  public grid1: IgxGridComponent;
  private _filterValues = new Map<IgxColumnComponent, any>();

  @ViewChild('close', { static: true }) close: ElementRef;
  @ViewChild('teamForm', { static: true }) form: any;

  teams: Master[];
  team: Master;
  formType: string = 'Add New';
  toastMsgName: string = 'Team';
  pageName: string = 'Team';

  constructor(
    private httpSvc: HttpService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private sidebarSvc: SidebarService,
    private aiLoggerSvc: MonitoringService
  ) {
    this.team = new Master();
  }

  ngOnInit() {
    this.sidebar();
    this.getTeams();
    this.aiLoggerSvc.AILogger(AILoggerPageName.TEAM,AILoggerAction.VIEW);
  }

  /// Set Selected Page Name in Sidebar
  sidebar() {
    this.sidebarSvc.filterChange(this.pageName);
  }

  /// Get All teams 
  getTeams() {
    this.httpSvc.get<any>(RestApi.teams).subscribe(data => {
      this.teams = data.contents;
    },
      errResp => {
        console.log(errResp);
      });
  }

  /// Add team 
  submit() {
    if (JSON.parse(sessionStorage.getItem('userId')) != null) {
      this.team.modifiedBy = JSON.parse(sessionStorage.getItem('userId'));
      this.httpSvc.post(RestApi.save_team, this.team).subscribe(
        res => {
          this.messageService.add({ severity: ToastMsg.save[res.status].status, summary: ToastMsg.save[res.status].msg.format(this.toastMsgName) });
          if (res.status == 1) { 
            this.aiLoggerSvc.AILogger(AILoggerPageName.TEAM,AILoggerAction.SAVE);
            this.refreshData(); 
          }
        });
    }
  }

  /// Edit team 
  onTeamEdit(teamId: number) {
    this.formType = 'Edit';
    this.httpSvc.get<Masters>(RestApi.get_team_by_id.format(teamId)).subscribe(data => {
      this.team.id = data.contents.id;
      this.team.name = data.contents.name;
    })
  }

  /// Delete team
  onTeamDelete(teamId: number) {
    if (JSON.parse(sessionStorage.getItem('userId')) != null) {
      this.team.modifiedBy = JSON.parse(sessionStorage.getItem('userId'));
      this.confirmationService.confirm({
        message: 'Do you want to delete this record?',
        header: 'Delete Confirmation',
        icon: 'pi pi-info-circle',
        accept: () => {
          this.httpSvc.delete(RestApi.delete_team.format(teamId, this.team.modifiedBy)).subscribe(
            res => {
              this.messageService.add({ severity: ToastMsg.delete[res.status].status, summary: ToastMsg.delete[res.status].msg.format(this.toastMsgName) });
              if (res.status == 1) { 
                this.aiLoggerSvc.AILogger(AILoggerPageName.TEAM,AILoggerAction.DELETE);
                this.refreshData(); 
              }
            });
        },
        reject: () => { }
      });
    }
  }

  /// Reset team Master Form
  resetForm() {
    this.form.resetForm();
    this.team.id = 0;
    this.team.name = '';
    this.formType = 'Add New';
  }

  /// Refresh team Master
  refreshData() {
    this.getTeams();
    this.close.nativeElement.click();
    this.resetForm();
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
      default:
        operand = IgxStringFilteringOperand.instance().condition("contains");
    }
    this.grid1.filter(column.field, this.transformValue(input.value, column), operand, column.filteringIgnoreCase);
  }

  public clearInput(column: IgxColumnComponent) {
    this._filterValues.delete(column);
    this.grid1.clearFilter(column.field);
  }

  private transformValue(value: any, column: IgxColumnComponent): any {
    if (column.dataType === DataType.Number) {
      value = parseFloat(value);
    }
    return value;
  }
  ///  Filter logic ends




}


