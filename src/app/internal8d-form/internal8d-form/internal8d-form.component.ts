import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, RouterEvent, NavigationEnd } from '@angular/router';
import { HttpService } from 'src/app/shared/services/http.service';
import { Internal8D, Internal8DRestApi, D1Users } from '../shared/models/internal8D';
import { RestApi } from 'src/app/shared/class/rest-api';
import { SidebarService } from 'src/app/shared/services/sidebar.service';
import { ConfirmationService } from 'primeng/api';
import { ConfirmationMessage, ConfirmationHeader, Internal8DStep } from '../shared/models/enums';
import { filter, takeUntil, find } from 'rxjs/operators';
import { Subject, Subscription, from } from 'rxjs';
import { RoleConstant } from 'src/app/shared/class/constant';

@Component({
  selector: 'app-internal8d-form',
  templateUrl: './internal8d-form.component.html',
  styleUrls: ['./internal8d-form.component.css']
})
export class Internal8dFormComponent implements OnInit {
  @ViewChild('internal8dTab', { static: false }) internal8dTab: ElementRef;

  routeUrl: string;
  currentTab: string = 'D1';
  internal8D: Internal8D;
  incidentId: number;
  internal8DProgressPercentage: number = 0;
  pageName: string = 'Internal 8D Form';
  refreshSubs: Subscription;
  public destroyed = new Subject<any>();
  @ViewChild('summaryLink', { static: false }) summaryLink: ElementRef<HTMLElement>;

  constructor(
    private router: Router,
    private httpSvc: HttpService,
    private activatedRoute: ActivatedRoute,
    private sidebarSvc: SidebarService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit() {
    this.refreshUrlData();
    this.getInternal8D();
    this.sidebarSvc.filterChange(this.pageName);
    //this.internal8DTab();
    this.refreshInternal8D();
  }

  /// Refresh link
  refreshUrlData() {
    this.refreshSubs = this.router.events.pipe(filter((event: RouterEvent) => event instanceof NavigationEnd), takeUntil(this.destroyed)).subscribe(() => {
      this.getInternal8D();
    });
  }

  internal8DTab() {
    this.sidebarSvc.internal8DTab.subscribe(
      data => {
        if (data) {
          this.getInternal8D();
        }
      });
  }

  /// Refresh User Role
  refreshInternal8D() {
    this.sidebarSvc.internal8D.subscribe(
      data => {
        this.getInternal8D();
      });
  }

  currentActiveStep() {
    let baseUri = this.router.url;
    let uri = baseUri.split('/');
    this.currentTab = uri[uri.length - 1];
    this.currentActiveClass();
  }

  currentActiveClass() {
    if (this.internal8dTab != undefined && this.internal8D != undefined) {
      /// D1 Step
      if (this.currentTab == Internal8DStep.D1 && this.internal8D.isD1Completed == true) {
        this.internal8dTab.nativeElement.childNodes[0].className = 'active';
      } else if (this.internal8D.isD1Completed == true) {
        this.internal8dTab.nativeElement.childNodes[0].className = 'completed';
      } else if (this.currentTab == Internal8DStep.D1) {
        this.internal8dTab.nativeElement.childNodes[0].className = 'active';
      } else {
        this.internal8dTab.nativeElement.childNodes[0].className = '';
      }

      /// D2 Step
      if (this.currentTab == Internal8DStep.D2 && this.internal8D.isD2Completed == true) {
        this.internal8dTab.nativeElement.childNodes[1].className = 'active';
      } else if (this.internal8D.isD2Completed == true) {
        this.internal8dTab.nativeElement.childNodes[1].className = 'completed';
      } else if (this.currentTab == Internal8DStep.D2) {
        this.internal8dTab.nativeElement.childNodes[1].className = 'active';
      } else {
        this.internal8dTab.nativeElement.childNodes[1].className = '';
      }

      /// D3 Step
      if (this.currentTab == Internal8DStep.D3 && this.internal8D.isD3Completed == true) {
        this.internal8dTab.nativeElement.childNodes[2].className = 'active';
      } else if (this.internal8D.isD3Completed == true) {
        this.internal8dTab.nativeElement.childNodes[2].className = 'completed';
      } else if (this.currentTab == Internal8DStep.D3) {
        this.internal8dTab.nativeElement.childNodes[2].className = 'active';
      } else {
        this.internal8dTab.nativeElement.childNodes[2].className = '';
      }

      /// D4 Step
      if (this.currentTab == Internal8DStep.D4 && this.internal8D.isD4Completed == true) {
        this.internal8dTab.nativeElement.childNodes[3].className = 'active';
      } else if (this.internal8D.isD4Completed == true) {
        this.internal8dTab.nativeElement.childNodes[3].className = 'completed';
      } else if (this.currentTab == Internal8DStep.D4) {
        this.internal8dTab.nativeElement.childNodes[3].className = 'active';
      } else {
        this.internal8dTab.nativeElement.childNodes[3].className = '';
      }

      /// D5 Step
      if (this.currentTab == Internal8DStep.D5 && this.internal8D.isD5Completed == true) {
        this.internal8dTab.nativeElement.childNodes[4].className = 'active';
      } else if (this.internal8D.isD5Completed == true) {
        this.internal8dTab.nativeElement.childNodes[4].className = 'completed';
      } else if (this.currentTab == Internal8DStep.D5) {
        this.internal8dTab.nativeElement.childNodes[4].className = 'active';
      } else {
        this.internal8dTab.nativeElement.childNodes[4].className = '';
      }

      /// D7 Step
      if (this.currentTab == Internal8DStep.D6 && this.internal8D.isD6Completed == true) {
        this.internal8dTab.nativeElement.childNodes[5].className = 'active';
      } else if (this.internal8D.isD6Completed == true) {
        this.internal8dTab.nativeElement.childNodes[5].className = 'completed';
      } else if (this.currentTab == Internal8DStep.D6) {
        this.internal8dTab.nativeElement.childNodes[5].className = 'active';
      } else {
        this.internal8dTab.nativeElement.childNodes[5].className = '';
      }

      /// D8 Step
      if (this.currentTab == Internal8DStep.D7 && this.internal8D.isD7Completed == true) {
        this.internal8dTab.nativeElement.childNodes[6].className = 'active';
      } else if (this.internal8D.isD7Completed == true) {
        this.internal8dTab.nativeElement.childNodes[6].className = 'completed';
      } else if (this.currentTab == Internal8DStep.D7) {
        this.internal8dTab.nativeElement.childNodes[6].className = 'active';
      } else {
        this.internal8dTab.nativeElement.childNodes[6].className = '';
      }

      /// D6 Step
      if (this.currentTab == Internal8DStep.D8 && this.internal8D.isD8Completed == true) {
        this.internal8dTab.nativeElement.childNodes[7].className = 'active';
      } else if (this.internal8D.isD8Completed == true) {
        this.internal8dTab.nativeElement.childNodes[7].className = 'completed';
      } else if (this.currentTab == Internal8DStep.D8) {
        this.internal8dTab.nativeElement.childNodes[7].className = 'active';
      } else {
        this.internal8dTab.nativeElement.childNodes[7].className = '';
      }
    }

  }

  /// Step Navigation
  redirectStep(tab: string) {
    if (this.sidebarSvc.formStatus == true) {
      this.confirmationService.confirm({
        message: ConfirmationMessage.UNSAVED_DATA,
        header: ConfirmationHeader.UNSAVED_DATA,
        icon: 'pi pi-info-circle',
        accept: () => {
          this.sidebarSvc.formStatus = false;
          this.navigateToStep(tab);
        },
        reject: () => {
          this.currentActiveClass();
        }
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

  validateStep(tab: string) {
    if (this.internal8D.isD5Completed) {
      this.redirectStep(tab);
    } else {
      let baseUri = this.router.url;
      let uri = baseUri.split('/');
      this.currentTab = uri[uri.length - 1];
      this.redirectStep(this.currentTab);
    }
  }

  /// Get Internal8D Tab Data
  getInternal8D() {
    let baseUri = this.router.url;
    let uri = baseUri.split('/');
    this.incidentId = Number(uri[uri.length - 2]);
    this.sidebarSvc.incidentId = this.incidentId;
    this.httpSvc.get<Internal8DRestApi>(RestApi.get_internal_8d_by_incidentid.format(this.incidentId)).subscribe(
      internal8dData => {
        this.internal8D = internal8dData.contents;
        this.currentActiveStep();
        this.internal8DProgressStatus();
        this.is8DFormEditable();
      });
  }

  /// Is 8D Form Editable
  is8DFormEditable() {
    if (this.internal8D) {
      let currentUser = Number(sessionStorage.getItem('userId'));
      let currentRole = Number(sessionStorage.getItem('currentRole'));
      /// Check if Current Role = User & D8 step is not completed
      if (currentRole == RoleConstant.user && this.internal8D.isD8Completed == false) {
        /// Check if LoggedIn User is Creater
        if (currentUser == this.internal8D.createdBy) {
          this.sidebarSvc.is8DFormEditable = true;
          this.sidebarSvc.internal8DFormEditableStatus();
        } else if (this.internal8D.d1UserIds.length != 0) {
          /// Check LoggedIn User is added in D1 Step 8D Form
          from<D1Users[]>(this.internal8D.d1UserIds).pipe(find(x => x.id == currentUser)).subscribe(data => {
            if (data) {
              this.sidebarSvc.is8DFormEditable = true;
              this.sidebarSvc.internal8DFormEditableStatus();
            } else {
              this.sidebarSvc.is8DFormEditable = false;
              this.sidebarSvc.internal8DFormEditableStatus();
            }
          });
        } else {
          this.sidebarSvc.is8DFormEditable = false;
          this.sidebarSvc.internal8DFormEditableStatus();
        }
      } else {
        this.sidebarSvc.is8DFormEditable = false;
        this.sidebarSvc.internal8DFormEditableStatus();
      }
    }
  }

  /// internal 8D Progress Status
  internal8DProgressStatus() {
    let d1 = this.internal8D.isD1Completed == true ? 1 : 0;
    let d2 = this.internal8D.isD2Completed == true ? 1 : 0;
    let d3 = this.internal8D.isD3Completed == true ? 1 : 0;
    let d4 = this.internal8D.isD4Completed == true ? 1 : 0;
    let d5 = this.internal8D.isD5Completed == true ? 1 : 0;
    let d6 = this.internal8D.isD6Completed == true ? 1 : 0;
    let d7 = this.internal8D.isD7Completed == true ? 1 : 0;
    let d8 = this.internal8D.isD8Completed == true ? 1 : 0;

    this.internal8DProgressPercentage = ((d1 + d2 + d3 + d4 + d5 + d6 + d7 + d8) / 8) * 100;
    this.sidebarSvc.incidentNumber = this.internal8D.incidentNumber;
    this.sidebarSvc.internal8DProgressStatus(this.internal8DProgressPercentage);
  }




}
