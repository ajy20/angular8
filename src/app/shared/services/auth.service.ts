import { Injectable } from '@angular/core';
import { MsAdalAngular6Service } from 'microsoft-adal-angular6';
import { Router } from '@angular/router';
import { HttpService } from './http.service';
import { RestApi } from '../class/rest-api';
import { Master } from 'src/app/models/master';
import { first } from 'rxjs/operators';
import { from } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SidebarService } from './sidebar.service';
import { RoleConstant, ApiResponse } from '../class/constant';
import { User } from 'src/app/models/user';

@Injectable()

export class AuthService {
  token: any;
  newLogin: boolean = false;
  user: User;
  pageName: string = 'home';

  constructor(
    private adalSvc: MsAdalAngular6Service,
    private httpSvc: HttpService,
    private sidebarSvc: SidebarService,
    private router: Router
  ) {
    if (!this.adalSvc.isAuthenticated) {
      this.adalSvc.acquireToken('<RESOURCE>').subscribe((resToken: string) => {
        if (resToken != null) {
          sessionStorage.setItem('token', resToken);
          let LoggedUserGID = this.adalSvc.LoggedInUserEmail.split("@")[0];
          sessionStorage.setItem("LoggedUserGID", LoggedUserGID);
          this.getAuthenticated(LoggedUserGID);
        }
      });
    }
  }

  renewToken() {
    this.adalSvc.acquireToken('<RESOURCE>').subscribe((resToken: string) => {
      if (resToken != null) {
        sessionStorage.setItem('token', resToken);
        let LoggedUserGID = this.adalSvc.LoggedInUserEmail.split("@")[0];
        sessionStorage.setItem("LoggedUserGID", LoggedUserGID);
        this.getAuthenticated(LoggedUserGID);
        this.getAccessToken();
      }
    });
  }


  public getToken(): string {
    return sessionStorage.getItem('token');
  }

  public isAuthenticated(): boolean {
    // get the token
    const token = this.getToken();
    // return a boolean reflecting
    // whether or not the token is expired
    // return tokenNotExpired(null, token);
    return false;
  }

  // User Authentication for Role
  public getAuthenticated(userGlobalId: string) {
    if (this.adalSvc.isAuthenticated) {
      this.httpSvc.get(RestApi.get_user_id.format(userGlobalId)).subscribe((res: any) => {
        if (res.status == 1 && res.contents.id > 0) {
          let userInfo = res.contents;
          sessionStorage.setItem('userId', res.contents.id);
          sessionStorage.setItem('userName', res.contents.name);
          sessionStorage.setItem('userRole', JSON.stringify(res.contents.roles));
          this.getUserRole(res.contents.roles);
        } else {
          //sessionStorage.clear();
          this.registerNewUser();
        }
      })
    } else {
      this.adalSvc.login();
    }
  }

  /// Register new user if not exists in User Master
  registerNewUser() {
    let LoggedUserGID = this.adalSvc.userInfo.userName.split("@")[0];
    this.user = {
      id: 0,
      name: this.adalSvc.userInfo.profile.name,
      globalId: LoggedUserGID,
      emailId: this.adalSvc.userInfo.userName,
      jobTitle: '',
      mobilePhone: null,
      userPrincipleName: LoggedUserGID,
      modifiedBy: null,
      roleNames: '',
      roleId: RoleConstant.user,
      roleIds: RoleConstant.user.toString(),
      roles: []
    }

    this.httpSvc.post(RestApi.save_user, this.user).subscribe(
      res => {
        if (res.status == ApiResponse.success) {
          this.getAuthenticated(this.adalSvc.userInfo.userName.split("@")[0]);
        }
        else {
          this.router.navigate(['/**']);
        }
      });
  }

  /// Returns first role from multiple roles
  getUserRole(userRole: Master[]) {
    from(userRole).pipe(first()).subscribe(
      data => {
        if (data) {
          let currentRole = data.id;
          if (Number(sessionStorage.getItem('currentRole')) != RoleConstant.user) {
            sessionStorage.setItem('currentRole', JSON.stringify(currentRole));
          }

          if (localStorage.getItem('redirectedURL')) {
            let redirectUri = localStorage.getItem('redirectedURL');
            let url = redirectUri.replace(window.location.href, '/');
            this.router.navigateByUrl(url);
          } else {
            currentRole == RoleConstant.admin
              ? this.router.navigate(['/user'])
              : (
                this.router.navigate(['/home'])
              );
          }
          this.sidebarSvc.roleChange();
        }
      });
  }

  /// Graph API Access Token
  async getAccessToken(): Promise<string> {
    this.adalSvc.acquireToken(environment.graph.graphApi).subscribe((token: string) => {
      sessionStorage.setItem("APIToken", token)
      this.token = token;
    });
    return this.token
  }

  logoutUser() {
    this.adalSvc.logout();
    sessionStorage.clear();
  }

  refreshGraphToken() {
    this.getAccessToken();
  }
}
