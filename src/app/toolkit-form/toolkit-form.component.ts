import { Component, OnInit, ViewChild } from '@angular/core';
import { RestApi } from '../shared/class/rest-api';
import { HttpService } from '../shared/services/http.service';
import { MessageService, ConfirmationService } from 'primeng/api';
import { SidebarService } from '../shared/services/sidebar.service';
import { RestApiAttachments, Attachment } from '../incident/shared/models/attachment';
import { ToastMsg, ToastMessage } from '../shared/class/toast-msg';
import { ConfirmationMessage, ConfirmationHeader, AILoggerPageName, AILoggerAction } from '../internal8d-form/shared/models/enums';
import { find } from 'rxjs/operators';
import { RoleConstant, EnumPageName, FileUploadSize } from '../shared/class/constant';
import { from } from 'rxjs';
import { IgxGridComponent } from 'igniteui-angular';
import { MonitoringService } from '../shared/services/monitoring.service';

@Component({
  selector: 'app-toolkit-form',
  templateUrl: './toolkit-form.component.html',
  styleUrls: ['./toolkit-form.component.css']
})
export class ToolkitFormComponent implements OnInit {
  @ViewChild("grid1", { read: IgxGridComponent, static: true })
  public grid1: IgxGridComponent;

  toolkitAttachment: Attachment[];
  uploadedFiles: any[] = [];
  uploadUrl: string;
  currentUser: number;
  currentRole: number;
  pageName: string = EnumPageName.TOOLKIT;
  downloadUrl: string;
  isEditable: boolean;
  fileUploadSize: number = FileUploadSize.FILE_UPLOAD_SIZE;

  constructor(
    private httpSvc: HttpService,
    private messageService: MessageService,
    private sidebarSvc: SidebarService,
    private confirmationService: ConfirmationService,
    private aiLoggerSvc: MonitoringService
  ) {
    this.uploadUrl = RestApi.incident_attachment;
  }

  ngOnInit() {
    this.currentUser = Number(sessionStorage.getItem('userId'));
    this.sidebar();
    this.getAttachments();
    this.aiLoggerSvc.AILogger(AILoggerPageName.TOOLKIT, AILoggerAction.VIEW);
  }

  /// Set Selected Page Name in Sidebar
  sidebar() {
    this.sidebarSvc.filterChange(this.pageName);
  }

  // Get Toolkit Attachments
  getAttachments() {
    this.httpSvc.get<RestApiAttachments>(RestApi.get_attachments.format(0, 0)).subscribe(data => {
      this.toolkitAttachment = data.contents;
      this.isStepEditable();
    });
  }

  /// Is Step Editable
  isStepEditable() {
    this.currentRole = Number(sessionStorage.getItem('currentRole'));
    this.currentRole == RoleConstant.admin ? this.isEditable = true : this.isEditable = false;
  }

  /// Delete Attachments
  deleteAttachment(id: number) {
    this.confirmationService.confirm({
      message: ConfirmationMessage.DELETE,
      header: ConfirmationHeader.DELETE,
      icon: 'pi pi-info-circle',
      accept: () => {
        if (this.currentUser != null) {
          this.httpSvc.delete(RestApi.delete_attachment.format(id, this.currentUser)).subscribe(
            res => {
              let status = '17';
              status += ("0" + res.status).slice(-2);
              this.messageService.add({ severity: ToastMessage[status].status, summary: ToastMessage[status].msg });
              if (res.status == 1) {
                this.aiLoggerSvc.AILogger(AILoggerPageName.TOOLKIT, AILoggerAction.DELETE);
                this.getAttachments();
              }
            });
        }
      },
      reject: () => { }
    });
  }

  /// File Upload 
  myUploader(event, form): void {
    if (event.files.length == 0) {
      return;
    }

    if (this.currentUser != null) {
      let input = new FormData();
      for (let file of event.files) {
        input.append("files", file);
      }

      this.httpSvc.post(this.uploadUrl.format(0, 0, this.currentUser), input).subscribe(
        res => {
          this.messageService.add({ severity: ToastMsg.upload[res.status].status, summary: ToastMsg.upload[res.status].msg });
          form.clear();
          this.getAttachments();
        });
    }
  }

  /// Download Attachment
  downloadAttachment(rowIndex) {
    let incidentId = this.grid1.getCellByColumn(rowIndex, "id").value;
    from<Attachment[]>(this.toolkitAttachment).pipe(find(x => x.id === incidentId)).subscribe(
      data => {
        this.downloadUrl = data.url;
      });
    window.open(this.downloadUrl);
  }

  getFileName(rowIndex: number) {
    let fileName;
    from<Attachment[]>(this.toolkitAttachment).pipe(find(x => x.id === rowIndex)).subscribe(data => {
      if (data) {
        fileName = data.name;
      }
    });

    return fileName;
  }

}
