
import { Directive, Input, TemplateRef, ViewContainerRef } from "@angular/core";
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';


@Directive({
  selector: "[roleAuth]"
})
export class RoleAuthDirective {

  allowedRoles: Number[];
  allowRole: boolean = false;
  currentRole: number;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private router: Router,
    private authService: AuthService
  ) { }

  @Input()

  set roleAuth(allowedRoles: Number[]) {

    // Roles passed to Directive
    this.allowedRoles = allowedRoles;

    /// || !this.authService.currentUser
    if (!this.allowedRoles || this.allowedRoles.length === 0) {
      this.viewContainer.clear();
      return;
    }

    this.currentRole = JSON.parse(sessionStorage.getItem('currentRole'));
    if (this.currentRole) {
      this.allowedRoles.filter(
        () => {
          if (this.allowedRoles.includes(this.currentRole)) {
            this.allowRole = true;
          } else {
            this.allowRole = false;
          }
        });
    }

    this.allowRole == true ? this.viewContainer.createEmbeddedView(this.templateRef) : this.viewContainer.clear();

  }

}