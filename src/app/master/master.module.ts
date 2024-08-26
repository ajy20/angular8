import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from "@angular/forms";
import { MasterRoutingModule } from './master-routing.module';
import { ProcessComponent } from './process/process.component';
import { ProcessFunctionComponent } from './process-function/process-function.component';
import { ProductComponent } from './product/product.component';
import { SystemComponent } from './system/system.component';
import { TeamsComponent } from './teams/teams.component';
import { IgxGridModule } from "igniteui-angular";
import { UserComponent } from './user/user.component';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { InputValidationDirective } from '../shared/directive/input-validation.directive';
import { IgxFilterComponent } from '../shared/components/igx-filter/igx-filter.component';
import { IgxComboModule } from 'igniteui-angular';

@NgModule({
  declarations: [
    ProcessComponent,
    ProcessFunctionComponent,
    ProductComponent,
    SystemComponent,
    TeamsComponent,
    UserComponent,
    InputValidationDirective,
    IgxFilterComponent
  ],
  imports: [
    CommonModule,
    IgxComboModule,
    FormsModule,
    AutocompleteLibModule,
    IgxGridModule.forRoot(),
    MasterRoutingModule
  ],
  providers:[ ]
})

export class MasterModule { }
