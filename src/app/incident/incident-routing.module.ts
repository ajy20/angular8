import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AllIncidentsGridComponent } from './all-incidents-grid/all-incidents-grid.component';
import { IncidentFormComponent } from './incident-form/incident-form.component';
import { EditIncidentFormComponent } from './edit-incident-form/edit-incident-form.component';
import { AuthGuard } from '../shared/guards/auth.guard';
import { RoleConstant } from '../shared/class/constant';


const routes: Routes = [
  { path: 'home', component: AllIncidentsGridComponent, pathMatch: 'full', canActivate: [AuthGuard], data: { roles: [RoleConstant.incidentApprover, RoleConstant.user] } },
  { path: 'incidentform/:id', component: IncidentFormComponent, pathMatch: 'full', canActivate: [AuthGuard], data: { roles: [RoleConstant.incidentApprover, RoleConstant.user] } },
  { path: 'incidentform', component: IncidentFormComponent, pathMatch: 'full', canActivate: [AuthGuard], data: { roles: [RoleConstant.incidentApprover, RoleConstant.user] } },
  { path: 'editIncidentform', component: EditIncidentFormComponent, pathMatch: 'full', canActivate: [AuthGuard], data: { roles: [RoleConstant.user] } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IncidentRoutingModule { }

export const routedComponent = [
  AllIncidentsGridComponent,
  IncidentFormComponent
]

