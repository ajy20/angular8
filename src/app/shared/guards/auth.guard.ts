import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { MsAdalAngular6Service } from 'microsoft-adal-angular6';
import { User } from 'src/app/models/user';
import { RoleConstant } from '../class/constant';

@Injectable({ providedIn: 'root' })

export class AuthGuard implements CanActivate {

    userDetails: User;
    currentRole: number;
    role: RoleConstant;
    allowRole: boolean = false;

    private allowedRoles: Number[];

    constructor(
        private router: Router,
        private adalSvc: MsAdalAngular6Service,
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

        // Check to see if a user has a valid token
        if (this.adalSvc.isAuthenticated) {
            // If they do, return true and allow the user to load app
            this.currentRole = JSON.parse(sessionStorage.getItem('currentRole'));

            if (this.currentRole) {
                this.allowedRoles = route.data["roles"];

                // Check Roles is allowed for requested page
                this.allowedRoles.filter(
                    () => {
                        if (this.allowedRoles.includes(this.currentRole)) {
                            this.allowRole = true;
                        } else {
                            this.allowRole = false;
                        }
                    });
                return this.allowRole;
            } else {
                return false;
            }

        }

        // If not, they redirect them to the login page
        else {
            this.adalSvc.login();
            return false;
        }

    }




}




