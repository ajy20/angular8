import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IncidentRoutingModule } from './incident-routing.module';
import { AllIncidentsGridComponent } from './all-incidents-grid/all-incidents-grid.component'
import { IncidentFormComponent } from './incident-form/incident-form.component';
import { IgxGridModule } from "igniteui-angular";
import { EditIncidentFormComponent } from './edit-incident-form/edit-incident-form.component';
import { CalendarModule } from 'primeng/calendar';
import { IgxComboModule } from 'igniteui-angular';
import { IgxDatePickerModule } from 'igniteui-angular';
import { FileUploadModule } from 'primeng/fileupload';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { customDateFormatPipe } from '../shared/pipe/custom-date-format.directive'
import { RoleAuthDirective } from '../shared/directive/role.directive';


@NgModule({
  declarations: [
    AllIncidentsGridComponent,
    IncidentFormComponent,
    EditIncidentFormComponent,
    customDateFormatPipe,
    RoleAuthDirective
  ],
  imports: [
    CommonModule,
    FileUploadModule,
    ScrollPanelModule,
    FormsModule,
    CalendarModule,
    IgxDatePickerModule,
    IgxComboModule,
    IgxGridModule.forRoot(),
    IncidentRoutingModule
  ],
  providers: [
    DatePipe
  ]
})
export class IncidentModule { }
