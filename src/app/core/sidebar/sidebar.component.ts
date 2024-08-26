import { Component, OnInit } from '@angular/core';
import { SidebarService } from 'src/app/shared/services/sidebar.service';
import { RoleConstant } from 'src/app/shared/class/constant';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  activeTab: string = 'Dashboard';
  pageAdmin: number = RoleConstant.admin;
  currentRole: number;

  constructor(
    private router: Router,
    private sidebarSvc: SidebarService
  ) { }

  ngOnInit() {
    this.refreshRoles();
    this.currentRole = JSON.parse(sessionStorage.getItem('currentRole'));
    this.sidebarSvc.filter$.subscribe(
      data => {
        if (data) {
          this.activeTab = data as string;
        } else {
          this.activeTab = 'Dashboard';
        }
      }
    );
  }


  refreshRoles() {
    this.sidebarSvc.role.subscribe(
      data => {
        this.currentRole = JSON.parse(sessionStorage.getItem('currentRole'));
      });
  }

}
