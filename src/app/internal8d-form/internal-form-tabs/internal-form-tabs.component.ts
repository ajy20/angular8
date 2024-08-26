import { Component, OnInit, Input } from '@angular/core';
import { SidebarService } from 'src/app/shared/services/sidebar.service';
import { IncidentService } from 'src/app/incident/shared/services/incident.service';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { HttpService } from 'src/app/shared/services/http.service';
import { RestApi } from 'src/app/shared/class/rest-api';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-internal-form-tabs',
  templateUrl: './internal-form-tabs.component.html',
  styleUrls: ['./internal-form-tabs.component.css']
})
export class InternalFormTabsComponent implements OnInit {
  internal8DProgress: number = 0;
  incidentNumber: string;
  incident8DUrl: string;


  constructor(
    private sidebarSvc: SidebarService,
    private incidentSvc: IncidentService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private httpSvc: HttpService,
    private http: HttpClient
  ) { }

  ngOnInit() {
    this.incidentNumber = this.sidebarSvc.incidentNumber;
    this.internal8DProgressStatus();
  }

  internal8DProgressStatus() {
    this.sidebarSvc.internal8DProgress.subscribe(
      data => {
        if (data) {
          this.incidentNumber = this.sidebarSvc.incidentNumber;
          this.internal8DProgress = data as number;
        } else {
          this.incidentNumber = this.sidebarSvc.incidentNumber;
          this.internal8DProgress = 0;
        }
      });
  }

  /// Navigation for Back to Incident Form 
  redirectToIncidentDetails() {
    if (this.sidebarSvc.formStatus == true) {
      this.confirmationService.confirm({
        message: 'Do you want proceed with unsaved data?',
        header: 'Unsaved Data',
        icon: 'pi pi-info-circle',
        accept: () => {
          this.sidebarSvc.formStatus = false;
          this.navigateToIncidentForm();
        },
        reject: () => { }
      });
    } else {
      this.navigateToIncidentForm();
    }
  }

  navigateToIncidentForm() {
    this.incidentSvc.incidentId = this.sidebarSvc.incidentId;
    this.router.navigate(['/incidentform']);
  }

  /// Navigation for 8D Toolkit Form
  redirectToToolkitForm(){
    if (this.sidebarSvc.formStatus == true) {
      this.confirmationService.confirm({
        message: 'Do you want proceed with unsaved data?',
        header: 'Unsaved Data',
        icon: 'pi pi-info-circle',
        accept: () => {
          this.sidebarSvc.formStatus = false;
          this.navigateToToolkitForm();
        },
        reject: () => { }
      });
    } else {
      this.navigateToToolkitForm();
    }
  }

  navigateToToolkitForm(){
    this.incidentSvc.incidentId = this.sidebarSvc.incidentId;
    this.router.navigate(['/toolkit']);
  }

  /// Print 8D PDF Click
 
  print8dPdf() {
    this.getPdf().subscribe((response) => {

      // It is necessary to create a new blob object with mime-type explicitly set
      // otherwise only Chrome works like it should
      const newBlob = new Blob([(response)], { type: 'application/pdf'});

      // IE doesn't allow using a blob object directly as link href
      // instead it is necessary to use msSaveOrOpenBlob
      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(newBlob);
        return;
      }
      // For other browsers:
      // Create a link pointing to the ObjectURL containing the blob.
      const downloadURL = URL.createObjectURL(newBlob);
      //window.open(downloadURL);

      var anchor = document.createElement("a");
      anchor.download = this.sidebarSvc.incidentNumber + ".pdf";
      anchor.href = downloadURL;
      anchor.click(); 

    });
  }

  //download.service.ts
  getPdf() {
    const httpOptions = {
      responseType: 'blob' as 'json'
    };
    return this.http.get<BlobPart>(RestApi.internal8d_print.format(this.sidebarSvc.incidentId), httpOptions);
  }

}
