import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Internal8dFormRoutingModule } from './internal8d-form-routing.module';
import { InternalFormTabsComponent } from './internal-form-tabs/internal-form-tabs.component';
import { Internal8dFormComponent } from './internal8d-form/internal8d-form.component';
import { D1FormComponent } from './d1-form/d1-form.component';
import { D2FormComponent } from './d2-form/d2-form.component';
import { D3FormComponent } from './d3-form/d3-form.component';
import { D4FormComponent } from './d4-form/d4-form.component';
import { D5FormComponent } from './d5-form/d5-form.component';
import { D6FormComponent } from './d6-form/d6-form.component';
import { D7FormComponent } from './d7-form/d7-form.component';
import { D8FormComponent } from './d8-form/d8-form.component';
import { UserPickerComponent } from './shared/component/user-picker/user-picker.component';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { CalendarModule } from 'primeng/calendar';
import { FileUploadModule } from 'primeng/fileupload';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { IgxGridModule } from "igniteui-angular";
import { IgxSelectModule, IgxDialogModule } from 'igniteui-angular';


@NgModule({
  declarations: [
    InternalFormTabsComponent,
    Internal8dFormComponent,
    D1FormComponent,
    D2FormComponent,
    D3FormComponent,
    D4FormComponent,
    D5FormComponent,
    D6FormComponent,
    D7FormComponent,
    D8FormComponent,
    UserPickerComponent
  ],
  imports: [
    CommonModule,
    IgxDialogModule,
    IgxGridModule,
    FileUploadModule,
    ScrollPanelModule,
    FormsModule,
    CalendarModule,
    AutocompleteLibModule,
    Internal8dFormRoutingModule,
    FormsModule,
    IgxGridModule,
    IgxSelectModule,
    ScrollPanelModule
  ]
})
export class Internal8dFormModule { }
