import { NgModule, ErrorHandler } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ToolkitFormComponent } from './toolkit-form/toolkit-form.component';
import { HeaderComponent } from './core/header/header.component';
import { SidebarComponent } from './core/sidebar/sidebar.component';
import { FooterComponent } from './core/footer/footer.component';
import { Page404Component } from './core/page404/page404.component';
import { LoaderComponent } from './core/loader/loader.component';
import { ToasterComponent } from './core/toaster/toaster.component';
import { IgxGridModule, IgxSelectModule } from "igniteui-angular";
import { AuthenticationGuard, MsAdalAngular6Module } from 'microsoft-adal-angular6';
import { AuthService } from './shared/services/auth.service';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { IncidentModule } from './incident/incident.module';
import { Internal8dFormModule } from './internal8d-form/internal8d-form.module';
import { Interceptor } from './core/interceptors/Interceptor.service';
import { MasterModule } from './master/master.module';
import { ToastrModule } from "ngx-toastr";
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';
import '../app/shared/class/string-utility';
import { NgxSpinnerModule } from "ngx-spinner";
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { FileUploadModule } from 'primeng/fileupload';
import { FileSizePipe } from './shared/pipe/file-size.pipe';
import { MonitoringService } from './shared/services/monitoring.service';
import { MonitoringErrorHandler } from './shared/services/error.handler';



@NgModule({
  declarations: [
    AppComponent,
    ToolkitFormComponent,
    HeaderComponent,
    SidebarComponent,
    FooterComponent,
    Page404Component,
    LoaderComponent,
    ToasterComponent,
    FileSizePipe
  ],
  imports: [
    BrowserModule,
    ScrollPanelModule,
    BrowserAnimationsModule,
    NgxSpinnerModule,
    ToastrModule.forRoot({
      timeOut: 3333333
      //positionClass: 'toast-top-right'
    }), 
    FormsModule,
    IgxSelectModule,
    IgxGridModule.forRoot(),
    HttpClientModule,
    AutocompleteLibModule,
    IncidentModule,
    Internal8dFormModule,
    MasterModule,
    ToastModule,
    ConfirmDialogModule,
    FileUploadModule,
    AppRoutingModule,
    /// ADAL Auth for Login
    MsAdalAngular6Module.forRoot({
      tenant: '',
      clientId: '',
      redirectUri: window.location.origin,    /// For Local
      endpoints: {
        "https://graph.microsoft.com": "https://graph.microsoft.com"
      },
      navigateToLoginRequestUrl: false,
      cacheLocation: 'sessionStorage',
    })
  ],
  providers: [
    MonitoringService,
    {
      provide: ErrorHandler,
      useClass: MonitoringErrorHandler
    },
    ConfirmationService,
    MessageService,
    AuthenticationGuard, 
    AuthService,
    { provide: HTTP_INTERCEPTORS, useClass: Interceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
