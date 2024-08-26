import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Page404Component } from './core/page404/page404.component';

import { AuthenticationGuard } from 'microsoft-adal-angular6';
import { UserPickerComponent } from './internal8d-form/shared/component/user-picker/user-picker.component';
import { ToolkitFormComponent } from './toolkit-form/toolkit-form.component';
import { ProductComponent } from './master/product/product.component';
import { TeamsComponent } from './master/teams/teams.component';
import { AuthGuard } from './shared/guards/auth.guard';
import { RoleConstant } from './shared/class/constant';
import { D1FormComponent } from './internal8d-form/d1-form/d1-form.component';
import { D2FormComponent } from './internal8d-form/d2-form/d2-form.component';
import { D3FormComponent } from './internal8d-form/d3-form/d3-form.component';
import { D4FormComponent } from './internal8d-form/d4-form/d4-form.component';
import { D5FormComponent } from './internal8d-form/d5-form/d5-form.component';
import { D6FormComponent } from './internal8d-form/d6-form/d6-form.component';
import { D7FormComponent } from './internal8d-form/d7-form/d7-form.component';
import { D8FormComponent } from './internal8d-form/d8-form/d8-form.component';
import { Internal8dFormComponent } from './internal8d-form/internal8d-form/internal8d-form.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'home',
    pathMatch: 'full',
    loadChildren: () => import('./incident/incident.module').then(mod => mod.IncidentModule)
  },
  { path: 'toolkit', component: ToolkitFormComponent },
  {
    path: 'user',
    pathMatch: 'full',
    loadChildren: () => import('./master/master.module').then(mod => mod.MasterModule)
  },
  { path: 'product', component: ProductComponent, pathMatch: 'full', canActivate: [AuthGuard], data: { roles: [RoleConstant.admin] } },
  { path: 'teams', component: TeamsComponent, pathMatch: 'full', canActivate: [AuthGuard], data: { roles: [RoleConstant.admin] } },


  {
    path: 'internal8dform', component: Internal8dFormComponent,
    children: [
      {
        path: ':id',
        children: [
          { path: '', component: D1FormComponent, canActivate: [AuthGuard], data: { roles: [RoleConstant.incidentApprover, RoleConstant.user] } },
          { path: 'D1', component: D1FormComponent, canActivate: [AuthGuard], data: { roles: [RoleConstant.incidentApprover, RoleConstant.user] } },
          { path: 'D2', component: D2FormComponent, canActivate: [AuthGuard], data: { roles: [RoleConstant.incidentApprover, RoleConstant.user] } },
          { path: 'D3', component: D3FormComponent, canActivate: [AuthGuard], data: { roles: [RoleConstant.incidentApprover, RoleConstant.user] } },
          { path: 'D4', component: D4FormComponent, canActivate: [AuthGuard], data: { roles: [RoleConstant.incidentApprover, RoleConstant.user] } },
          { path: 'D5', component: D5FormComponent, canActivate: [AuthGuard], data: { roles: [RoleConstant.incidentApprover, RoleConstant.user] } },
          { path: 'D6', component: D6FormComponent, canActivate: [AuthGuard], data: { roles: [RoleConstant.incidentApprover, RoleConstant.user] } },
          { path: 'D7', component: D7FormComponent, canActivate: [AuthGuard], data: { roles: [RoleConstant.incidentApprover, RoleConstant.user] } },
          { path: 'D8', component: D8FormComponent, canActivate: [AuthGuard], data: { roles: [RoleConstant.incidentApprover, RoleConstant.user] } },
        ]
      }
    ]
  },




  // /// Lazy loading D1Form Component from internal8d-form module
  {
    path: 'internal8dform',
    pathMatch: 'full',
    loadChildren: () => import('./internal8d-form/internal8d-form.module').then(mod => mod.Internal8dFormModule)
  },
  { path: '**', component: Page404Component }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    onSameUrlNavigation: 'reload'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
