import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { D1FormComponent } from './d1-form/d1-form.component';
import { Internal8dFormComponent } from './internal8d-form/internal8d-form.component';


const routes: Routes = [
   { path: 'internal8dform', component: Internal8dFormComponent }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Internal8dFormRoutingModule { }

export const routedComponents = [
  Internal8dFormComponent
];

