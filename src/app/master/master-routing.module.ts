import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserComponent } from './user/user.component';
import { TeamsComponent } from './teams/teams.component';
import { AuthGuard } from '../shared/guards/auth.guard';
import { RoleConstant } from '../shared/class/constant';


const routes: Routes = [
  { path: 'user', component: UserComponent, pathMatch: 'full', canActivate: [AuthGuard], data: { roles: [RoleConstant.admin] } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class MasterRoutingModule { }

export const routedComponent = [
  UserComponent,
  TeamsComponent
]
