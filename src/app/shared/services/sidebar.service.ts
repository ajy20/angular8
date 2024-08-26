import { Injectable } from '@angular/core';
import { Subject, ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  formStatus: boolean = false;
  selectedRole: number;
  incidentId: number;
  incidentNumber: string;
  filter = new Subject();
  filter$ = this.filter.asObservable();

  role = new ReplaySubject(0);
  userRole = new ReplaySubject(0);
  internal8D = new ReplaySubject(0);
  internal8DFormSatus = new ReplaySubject(0);

  internal8DTab = new ReplaySubject(0);
  internal8DTab$ = this.filter.asObservable();
  internal8DProgress = new ReplaySubject(0);

  is8DFormEditable: boolean = false;

  constructor() { }

  internal8DFormEditableStatus() {
    this.internal8DFormSatus.next(Math.random());
  }

  filterChange(pageName: string) {
    this.filter.next(pageName);
  }

  roleChange() {
    this.role.next(Math.random())
  }

  verifyUserRole() {
    this.userRole.next(Math.random())
  }

  setIncidentId(id: number, incidentNum: string) {
    this.incidentId = id;
    this.incidentNumber = incidentNum;
  }

  refreshInternal8D() {
    this.clearRedirectUrl();
    this.internal8D.next(Math.random());
  }

  clearRedirectUrl() {
    if (localStorage.getItem('redirectedURL')) {
      localStorage.clear();
    }
  }

  internal8DTabChange(tabName: string) {
    this.internal8DTab.next(tabName);
  }

  internal8DProgressStatus(progress: number) {
    this.internal8DProgress.next(progress)
  }

  isFormDirty(status: boolean) {
    this.selectedRole = JSON.parse(sessionStorage.getItem('currentRole'));
    this.formStatus = status;
  }



}




