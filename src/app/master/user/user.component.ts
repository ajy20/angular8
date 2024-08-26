import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { DataType, IgxColumnComponent, IgxGridComponent, IgxNumberFilteringOperand, IgxStringFilteringOperand } from "igniteui-angular";
import { User, Users } from 'src/app/models/user';
import { GraphService } from 'src/app/shared/services/graph.service';
import { RestApi } from 'src/app/shared/class/rest-api';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ToastMsg } from 'src/app/shared/class/toast-msg';
import { HttpService } from 'src/app/shared/services/http.service';
import { Master, RoleMaster } from 'src/app/models/master';
import { AuthService } from 'src/app/shared/services/auth.service';
import { SidebarService } from 'src/app/shared/services/sidebar.service';
import { Router } from '@angular/router';
import { from } from 'rxjs';
import { find, first } from 'rxjs/operators';
import { RoleConstant, ApiResponse } from 'src/app/shared/class/constant';
import { AILoggerPageName, AILoggerAction } from 'src/app/internal8d-form/shared/models/enums';
import { MonitoringService } from 'src/app/shared/services/monitoring.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  @ViewChild("grid1", { read: IgxGridComponent, static: false })
  public grid1: IgxGridComponent;
  private _filterValues = new Map<IgxColumnComponent, any>();

  @ViewChild('close', { static: false }) close: ElementRef;
  @ViewChild('userForm', { static: false }) userForm: any;

  users: User[];
  user: User;
  roles: Master[];
  crossIconFlag: boolean = false;
  loadingGraphUserFlag: boolean = false;
  keyword: string = 'userPrincipalName';
  results: any;
  formType: string = 'Add New';
  selectedRoles: Master[] = [];
  toastMsgName: string = 'User';
  pageName: string = 'Manage User';
  editFlag: boolean = false;

  constructor(
    private httpSvc: HttpService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private graphSvc: GraphService,
    private sidebarSvc: SidebarService,
    private authSvc: AuthService,
    private aiLoggerSvc: MonitoringService
  ) {
    this.user = new User();
  }

  ngOnInit() {
    this.refreshRoles();
    this.sidebar();
    this.getUsers();
    this.verifyCurrentRole();
    this.aiLoggerSvc.AILogger(AILoggerPageName.USER, AILoggerAction.VIEW);
  }

  /// Set Selected Page Name in Sidebar
  sidebar() {
    this.sidebarSvc.filterChange(this.pageName);
  }

  /// Get All Users 
  getUsers() {
    this.httpSvc.get<any>(RestApi.users).subscribe(data => {
      this.users = data.contents;
    },
      errResp => {
        console.log(errResp);
      });
  }

  /// Add User 
  submit() {
    if (JSON.parse(sessionStorage.getItem('userId')) != null || JSON.parse(sessionStorage.getItem('currentRole')) != null) {
      this.user.modifiedBy = JSON.parse(sessionStorage.getItem('userId'));
      this.editFlag == true ? this.user.globalId = this.user.userPrincipleName : this.user.userPrincipleName = this.user.globalId;
      this.user.roleId = JSON.parse(sessionStorage.getItem('currentRole'));
      this.user.roleIds = this.selectedRoles.toString();
      this.httpSvc.post(RestApi.save_user, this.user).subscribe(
        res => {
          this.messageService.add({ severity: ToastMsg.save[res.status].status, summary: ToastMsg.save[res.status].msg.format(this.toastMsgName) });
          if (res.status == 1) {
            this.aiLoggerSvc.AILogger(AILoggerPageName.USER, AILoggerAction.SAVE);
            this.refreshData();
          }
          else if (res.status == ApiResponse.unauthorizedUser) {
            this.close.nativeElement.click();
            this.sidebarSvc.verifyUserRole();
          }
        });
    }
  }

  /// Edit User 
  onUserEdit(userId: number) {
    this.formType = 'Edit';
    this.getRoles();
    this.httpSvc.get<Users>(RestApi.get_user_by_id.format(userId)).subscribe(data => {
      this.editFlag = true;
      this.user.userPrincipleName = data.contents.globalId;
      this.user.globalId = data.contents.globalId;
      this.user.name = data.contents.name;
      this.user.emailId = data.contents.emailId;
      this.user.roleId = data.contents.roleId;
      this.user.id = data.contents.id;
      let roles = data.contents.roleIds.split(',');
      let userRoles = [];
      roles.forEach(element => {
        userRoles.push(Number(element));
      });
      this.selectedRoles = userRoles as [];

    })
  }

  /// Delete User
  onUserDelete(userId: number) {
    if (JSON.parse(sessionStorage.getItem('userId')) != null) {
      this.user.modifiedBy = JSON.parse(sessionStorage.getItem('userId'));
      this.confirmationService.confirm({
        message: 'Do you want to delete this record?',
        header: 'Delete Confirmation',
        icon: 'pi pi-info-circle',
        accept: () => {
          this.httpSvc.delete(RestApi.delete_user.format(userId, this.user.modifiedBy)).subscribe(
            res => {
              this.messageService.add({ severity: ToastMsg.delete[res.status].status, summary: ToastMsg.delete[res.status].msg.format(this.toastMsgName) });
              if (res.status == 1) {
                this.aiLoggerSvc.AILogger(AILoggerPageName.USER, AILoggerAction.DELETE);
                this.refreshData();
              }
            });
        },
        reject: () => { }
      });
    }
  }

  /// Get Roles
  getRoles() {
    this.httpSvc.get<RoleMaster>(RestApi.roles).subscribe(data => {
      this.roles = data.contents
    });
  }


  /// Reset User Master Form
  resetform() {
    //this.userForm.reset(this.user);
    this.user.id = this.user.roleId = 0;
    this.selectedRoles = [];
    this.formType = 'Add New';
  }

  /// Refresh Account Master
  refreshData() {
    this.editFlag = false;
    this.inputClearSearch();
    this.resetform();
    if (this.close != undefined) { this.close.nativeElement.click(); }
    this.getUsers();
    this.refreshRoles();
  }

  refreshRoles() {
    this.sidebarSvc.roleChange();
    this.sidebarSvc.verifyUserRole();
  }

  /// Check for existing role in UserRole
  verifyCurrentRole() {
    this.sidebarSvc.userRole.subscribe(
      data => {
        let globalId = sessionStorage.getItem('LoggedUserGID');
        this.httpSvc.get(RestApi.get_user_id.format(globalId)).subscribe((res: any) => {
          if (res.status == 1 && res.contents.id > 0) {
            let userRole = res.contents.roles;

            from<Master[]>(userRole).pipe(find(x => x.id == RoleConstant.admin)).subscribe(
              data => {
                if (!data) {
                  this.authSvc.getAuthenticated(globalId);
                }
              });
          } else {
            this.router.navigate(['/**']);
          }
        });
      });
  }

  /// Add User Popup
  addUserPopup() {
    this.inputClearSearch();
    this.formType = 'Add New';
    this.user.id = this.user.roleId = 0;
    this.getRoles();
  }




  /// Global Id input event
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
    this.user.userPrincipleName = getglobalID;
    this.user.globalId = getglobalID;
    this.user.name = item.displayName;
    this.user.emailId = item.mail;
  }

  /// Resets globalId, Name, Email Field
  inputClearSearch() {
    this.user.userPrincipleName = this.user.globalId = this.user.emailId = this.user.name = '';
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






