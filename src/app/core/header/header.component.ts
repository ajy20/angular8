import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { MsAdalAngular6Service } from 'microsoft-adal-angular6';
import { Master } from 'src/app/models/master';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import { SidebarService } from 'src/app/shared/services/sidebar.service';
import { RoleConstant } from 'src/app/shared/class/constant';
import { HttpService } from 'src/app/shared/services/http.service';
import { RestApi } from 'src/app/shared/class/rest-api';
import { Subject, Subscription, from } from 'rxjs';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  /// Pass data using Event Emitter (Child-Parent)
  @Output() leftNavStatus = new EventEmitter<boolean>();
  @ViewChild('roleForm', { static: true }) form: any;
  sidebarStatus: boolean = false;
  userName: string;
  roleName: string;
  userRole: Master[];
  currentRole: number;
  pageHeaderName: string;
  userRolesSubs: Subscription;

  constructor(
    private router: Router,
    private authSvc: AuthService,
    private httpSvc: HttpService,
    private adalSvc: MsAdalAngular6Service,
    private sidebarSvc: SidebarService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit() {
    this.refreshRoles();
    this.pageHeader();
    this.getUserRoles();
  }

  /// Refresh User Role
  refreshRoles() {
    this.userRolesSubs = this.sidebarSvc.role.subscribe(
      data => {
        this.getUserRoles();
      });
  }

  /// Refresh Page Header Name
  pageHeader() {
    this.sidebarSvc.filter$.subscribe(
      data => {
        if (data) {
          this.pageHeaderName = data as string;
        } else {
          this.pageHeaderName = 'Dashboard';
        }
      });
  }

  sidebarClick() {
    this.sidebarStatus == true ? this.sidebarStatus = false : this.sidebarStatus = true;
    this.leftNavStatus.emit(this.sidebarStatus);
  }

  logout() {
    sessionStorage.clear();
    this.adalSvc.logout();
  }

  /// Change Role
  changeRole(event) {
    let role = event.currentTarget.value;
    let selectedRole = Number(sessionStorage.getItem('currentRole'));
    sessionStorage.setItem('currentRole', role);
    this.sidebarSvc.roleChange();
    role == RoleConstant.admin ? this.router.navigate(['/user']) : this.router.navigate(['/home']);
  }

  /// Get User Roles
  getUserRoles() {
    let globalId = sessionStorage.getItem('LoggedUserGID');
    this.httpSvc.get(RestApi.get_user_id.format(globalId)).subscribe((res: any) => {
      if (res.status == 1 && res.contents.id > 0) {
        this.userName = res.contents.name;
        sessionStorage.setItem('userRole', JSON.stringify(res.contents.roles));
        this.currentRole = JSON.parse(sessionStorage.getItem('currentRole'));
        this.userRole = res.contents.roles;
      } else {
        this.authSvc.registerNewUser();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.userRolesSubs) { this.userRolesSubs.unsubscribe(); }

  }

}
