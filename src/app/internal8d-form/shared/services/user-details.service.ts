import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { User } from 'src/app/models/user';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserDetailsService {

  _userDetails = new Subject();
  userDetails$ = this._userDetails.asObservable();
  userData: User;

  constructor(
    private httpSrv: HttpClient,
  ) { }

  getSelectedUserDetails(selectedUser) {

    this.userData.name = selectedUser.displayName.toString();
    this.userData.emailId = selectedUser.mail;
    this.userData.jobTitle = selectedUser.jobTitle;
    this.userData.mobilePhone = selectedUser.mobilePhone;
    let globalId = selectedUser.userPrincipalName.split('@')[0];
    this.userData.globalId = globalId;
    this._userDetails.next(selectedUser);
  }

}
