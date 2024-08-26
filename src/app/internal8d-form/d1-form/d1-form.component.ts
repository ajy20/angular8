import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { GraphService } from 'src/app/shared/services/graph.service';
import { MemberType, ConfirmationMessage, ConfirmationHeader, DStatus, AILoggerPageName, AILoggerAction } from '../shared/models/enums';
import { RestApiData } from 'src/app/models/master';
import { RestApi } from 'src/app/shared/class/rest-api';
import { HttpService } from 'src/app/shared/services/http.service';
import { ToastMsg, ToastMessage } from 'src/app/shared/class/toast-msg';
import { MessageService, ConfirmationService } from 'primeng/api';
import { SidebarService } from 'src/app/shared/services/sidebar.service';
import { RoleConstant } from 'src/app/shared/class/constant';
import { D1Model } from '../shared/models/D1Model';
import { MonitoringService } from 'src/app/shared/services/monitoring.service';


@Component({
  selector: 'app-d1-form',
  templateUrl: './d1-form.component.html',
  styleUrls: ['./d1-form.component.css']
})
export class D1FormComponent implements OnInit {
  @ViewChild('d1Form', { static: false }) d1Form: NgForm;
  toastMsgName: string = "d1";
  incidentId: number;
  currentUserId: number;
  currentRoleId: number;
  data: any;
  isEditable: boolean;
  routeUrl: string;
  results: any;
  crossIconFlag: boolean = false;
  loadingGraphUserFlag: boolean = false;
  keyword: string = 'displayName';
  currentRole: number;
  currentUser: number;
  isAppoverEditable: boolean = false;

  championMemberType: string = MemberType.CHAMPION;
  teamLeadMemberType: string = MemberType.TEAMLEAD;
  coreMemberType: string = MemberType.CORE;
  extendedMemberType: string = MemberType.EXTENDED;
  approverMemberType: string = MemberType.APPROVER;

  newUser: User[] = [];
  newUserTempId: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private graphSvc: GraphService,
    private httpSvc: HttpService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private sidebarSvc: SidebarService,
    private aiLoggerSvc: MonitoringService
  ) {
    this.newUser[MemberType.CORE] = {} as User;
    this.newUser[MemberType.EXTENDED] = {} as User;
    this.newUser[MemberType.APPROVER] = {} as User;
  }

  ngOnInit() {
    this.is8DFormEditable();
    this.refreshInternal8D();
    this.sidebarSvc.internal8DTabChange('D1');
    this.incidentId = this.route.snapshot.params.id as number;
    this.currentUserId = JSON.parse(sessionStorage.getItem('userId'));
    this.currentRoleId = JSON.parse(sessionStorage.getItem('currentRole'));
    this.data = this.getData();
    this.aiLoggerSvc.AILogger(AILoggerPageName.D1, AILoggerAction.VIEW);
  }

  /// Check if Internal 8D Form is Editable
  is8DFormEditable() {
    this.sidebarSvc.internal8DFormSatus.subscribe(data => {
      this.sidebarSvc.is8DFormEditable == true ? this.isEditable = true : this.isEditable = false;
    });
  }

  refreshInternal8D() {
    this.sidebarSvc.refreshInternal8D();
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
  selectSearchEvent(item, user) {
    let userEmail = item.userPrincipalName;
    let getglobalID = userEmail.split("@")[0];

    user.globalId = getglobalID;
    user.fullName = item.displayName;
    user.emailId = item.mail;
    user.jobTitle = item.jobTitle;
    user.mobilePhone = item.mobilePhone;
  }

  /// Resets globalId, Name, Email Field
  inputClearSearch(target) {
    if (target === MemberType.CHAMPION)
      this.data.champion = {} as User;
    else if (target === MemberType.TEAMLEAD)
      this.data.teamLead = {} as User;
    else
      this.newUser[target] = {} as User;
  }

  getData() {
    this.httpSvc.get<RestApiData>(RestApi.get_d1.format(this.incidentId)).subscribe(data => {
      this.data = data.contents;
      if (this.data.champion === null)
        this.data.champion = {} as User;

      if (this.data.teamLead === null)
        this.data.teamLead = {} as User;

      if (this.data.coreTeamMembers === null)
        this.data.coreTeamMembers = [];

      if (this.data.extendedTeamMembers === null)
        this.data.extendedTeamMembers = [];

      if (this.data.approvers === null)
        this.data.approvers = [];

      this.isAppoverEditable = this.data.d5Status == DStatus.NOT_REQUESTED || this.data.d5Status == DStatus.REJECT;
    });
    return this.data;
  }

  submit() {
    let dataToSave: User[] = [];
    this.data.champion.memberType = MemberType.CHAMPION;
    this.data.teamLead.memberType = MemberType.TEAMLEAD;
    this.data.champion.fullName = typeof this.data.champion.fullName == 'object' ? this.data.champion.fullName.displayName : this.data.champion.fullName;
    this.data.teamLead.fullName = typeof this.data.teamLead.fullName == 'object' ? this.data.teamLead.fullName.displayName : this.data.teamLead.fullName;

    dataToSave.push(this.data.champion);
    dataToSave.push(this.data.teamLead);
    dataToSave = dataToSave.concat(this.data.coreTeamMembers);
    dataToSave = dataToSave.concat(this.data.extendedTeamMembers);
    dataToSave = dataToSave.concat(this.data.approvers);

    dataToSave.forEach(element => {
      element = element as User;
    });

    this.httpSvc.post(RestApi.save_d1.format(this.incidentId, this.currentUserId, this.data.isCompleted), dataToSave).subscribe(
      res => {
        let d1SaveStatus = '12';
        d1SaveStatus += ("0" + res.status).slice(-2);
        this.messageService.add({ severity: ToastMessage[d1SaveStatus].status, summary: ToastMessage[d1SaveStatus].msg });
        this.sidebarSvc.formStatus = false;
        this.aiLoggerSvc.AILogger(AILoggerPageName.D1, AILoggerAction.SAVE);
        this.refreshInternal8D();
        this.getData();
      });
  }

  addNewMember(target) {
    this.newUser[target].id = this.newUserTempId;
    this.newUser[target].memberType = target;

    if (target === MemberType.CORE && this.newUser[target].emailId != undefined && this.newUser[target].globalId != undefined)
      this.data.coreTeamMembers.push(this.newUser[target]);
    else if (target === MemberType.EXTENDED && this.newUser[target].emailId != undefined && this.newUser[target].globalId != undefined)
      this.data.extendedTeamMembers.push(this.newUser[target]);
    else if (target === MemberType.APPROVER && this.newUser[target].emailId != undefined && this.newUser[target].globalId != undefined)
      this.data.approvers.push(this.newUser[target]);

    this.newUser[target] = {} as User;
    this.newUserTempId = this.newUserTempId - 1;
  }

  deleteMember(target, id) {
    if (Number(sessionStorage.getItem('userId')) != null) {
      this.confirmationService.confirm({
        message: ConfirmationMessage.DELETE,
        header: ConfirmationHeader.DELETE,
        icon: 'pi pi-info-circle',
        accept: () => {
          if (target === MemberType.CORE) {
            this.data.coreTeamMembers = this.data.coreTeamMembers.filter(p => p.id !== id);
          }
          else if (target === MemberType.EXTENDED) {
            this.data.extendedTeamMembers = this.data.extendedTeamMembers.filter(p => p.id !== id);
          }
          else if (target === MemberType.APPROVER) {
            this.data.approvers = this.data.approvers.filter(p => p.id !== id);
          }


          if (id > 0) {
            this.httpSvc.delete(RestApi.delete_member.format(id, this.currentUserId)).subscribe(
              res => {
                let d1DeleteStatus = '13';
                d1DeleteStatus += ("0" + res.status).slice(-2);
                this.messageService.add({ severity: ToastMessage[d1DeleteStatus].status, summary: ToastMessage[d1DeleteStatus].msg });
                this.aiLoggerSvc.AILogger(AILoggerPageName.D1, AILoggerAction.DELETE);
                this.getData();
              });
          }
        },
        reject: () => { }
      });
    }
  }

  /// Step Navigation
  redirectToStep(tab: string) {
    if (this.sidebarSvc.formStatus == true) {
      this.confirmationService.confirm({
        message: ConfirmationMessage.UNSAVED_DATA,
        header: ConfirmationHeader.UNSAVED_DATA,
        icon: 'pi pi-info-circle',
        accept: () => {
          this.sidebarSvc.formStatus = false;
          this.navigateToStep(tab);
        },
        reject: () => { }
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

  formIsDirty() {
    this.sidebarSvc.formStatus = true;
  }

}
