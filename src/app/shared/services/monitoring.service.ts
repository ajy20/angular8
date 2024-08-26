import { Router } from '@angular/router';
import { AppInsights } from 'applicationinsights-js';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { SidebarService } from './sidebar.service';
import { RoleConstant } from '../class/constant';
import { MemberType } from 'src/app/internal8d-form/shared/models/enums';


@Injectable()
export class MonitoringService {

    constructor(
        private router: Router,
        private sidebarSvc: SidebarService
    ) {
        if (environment.appInsightsConfig && environment.appInsightsConfig.instrumentationKey) {
            AppInsights.downloadAndSetup(environment.appInsightsConfig);
        }
    }

    /// Application Insight Logger (AI Logger)
    AILogger(pageName: string, pageAction?: string) {
        let currentRole;
        let LoggedUserGID = sessionStorage.getItem('LoggedUserGID');
        let loggedUserRole = Number(sessionStorage.getItem('currentRole'));
        
        if (loggedUserRole == RoleConstant.admin) {
            currentRole = MemberType.ADMIN
        } else if (loggedUserRole == RoleConstant.incidentApprover) {
            currentRole = MemberType.APPROVER;
        } else {
            currentRole = MemberType.USER;
        }

        let properties = {
            Action: pageAction,
            IncidentNumber: this.sidebarSvc.incidentNumber != undefined ? this.sidebarSvc.incidentNumber : '0',
            LoggedUserGlobalID: LoggedUserGID,
            Role: currentRole
        }
        AppInsights.setAuthenticatedUserContext(LoggedUserGID);
        AppInsights.trackPageView(pageName, this.router.url, properties);
    }

    public AddGlobalProperties(properties?: { [key: string]: string }): { [key: string]: string } {
        if (!properties) {
            properties = {};
        }

        return properties;
    }

    public logEvent(name: string, properties?: { [key: string]: string }, measurements?: { [key: string]: number }) {
        AppInsights.trackEvent(name, this.AddGlobalProperties(properties), measurements);
    }

    public logError(error: Error, properties?: { [key: string]: string }, measurements?: { [key: string]: number }) {
        AppInsights.trackException(error, null, this.AddGlobalProperties(properties), measurements);
    }
}
