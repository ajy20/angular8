import { Component, OnInit } from '@angular/core';
import { AuthService } from './shared/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'repo8d-web';
  sidebarStatus: boolean = false;

  constructor(
    private authSvc: AuthService
  ) { }

  ngOnInit(): void {
    this.getDetails();
  }

  /// Method to catch event from Header Component (Child Component) using Event Emitter
  sidebarClick($event) {
    this.sidebarStatus = $event;
  }

  getDetails() {
    if (localStorage.getItem('redirectedURL') == undefined || localStorage.getItem('redirectedURL') == null) {
      localStorage.setItem('redirectedURL', window.location.href);
    }
    this.authSvc.renewToken();
  }

}
