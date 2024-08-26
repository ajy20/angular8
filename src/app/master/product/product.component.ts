import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { DataType, IgxColumnComponent, IgxGridComponent, IgxNumberFilteringOperand, IgxStringFilteringOperand } from "igniteui-angular";
import { HttpService } from 'src/app/shared/services/http.service';
import { MessageService, ConfirmationService } from 'primeng/api';
import { RestApi } from 'src/app/shared/class/rest-api';
import { ToastMsg } from 'src/app/shared/class/toast-msg';
import { Master, Masters, LeftNav } from 'src/app/models/master';
import { ActivatedRoute } from '@angular/router';
import { SidebarService } from 'src/app/shared/services/sidebar.service';
import { AILoggerPageName, AILoggerAction } from 'src/app/internal8d-form/shared/models/enums';
import { MonitoringService } from 'src/app/shared/services/monitoring.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  @ViewChild("grid1", { read: IgxGridComponent, static: true })
  public grid1: IgxGridComponent;
  private _filterValues = new Map<IgxColumnComponent, any>();

  @ViewChild('close', { static: true }) close: ElementRef;
  @ViewChild('productForm', { static: true }) form: any;

  products: Master[];
  product: Master;
  formType: string = 'Add New';
  toastMsgName: string = 'Product';
  sidebarNav: LeftNav;

  constructor(
    private httpSvc: HttpService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private sidebarSvc: SidebarService,
    private aiLoggerSvc: MonitoringService
  ) {
    this.product = new Master();
  }

  ngOnInit() {
    this.sidebar();
    this.getProducts();
    this.aiLoggerSvc.AILogger(AILoggerPageName.PRODUCT,AILoggerAction.VIEW);
  }

  /// Set Selected Page Name in Sidebar
  sidebar() {
    this.sidebarSvc.filterChange(this.toastMsgName);
  }

  /// Get All Products 
  getProducts() {
    this.httpSvc.get<any>(RestApi.products).subscribe(data => {
      this.products = data.contents;
    },
      errResp => {
        console.log(errResp);
      });
  }

  /// Add Product 
  submit() {
    if (JSON.parse(sessionStorage.getItem('userId')) != null) {
      this.product.modifiedBy = JSON.parse(sessionStorage.getItem('userId'));
      this.httpSvc.post(RestApi.save_product, this.product).subscribe(
        res => {
          this.messageService.add({ severity: ToastMsg.save[res.status].status, summary: ToastMsg.save[res.status].msg.format(this.toastMsgName) });
          if (res.status == 1) { 
            this.aiLoggerSvc.AILogger(AILoggerPageName.PRODUCT,AILoggerAction.SAVE);
            this.refreshData(); 
          }
        });
    }
  }

  /// Edit Product 
  onProductEdit(productId: number) {
    this.formType = 'Edit';
    this.httpSvc.get<Masters>(RestApi.get_product_by_id.format(productId)).subscribe(data => {
      this.product.id = data.contents.id;
      this.product.name = data.contents.name;
    })
  }

  /// Delete Product
  onProductDelete(productId: number) {
    if (JSON.parse(sessionStorage.getItem('userId')) != null) {
      this.product.modifiedBy = JSON.parse(sessionStorage.getItem('userId'));
      this.confirmationService.confirm({
        message: 'Do you want to delete this record?',
        header: 'Delete Confirmation',
        icon: 'pi pi-info-circle',
        accept: () => {
          this.httpSvc.delete(RestApi.delete_product.format(productId, this.product.modifiedBy)).subscribe(
            res => {
              this.messageService.add({ severity: ToastMsg.delete[res.status].status, summary: ToastMsg.delete[res.status].msg.format(this.toastMsgName) });
              if (res.status == 1) { 
                this.aiLoggerSvc.AILogger(AILoggerPageName.PRODUCT,AILoggerAction.DELETE);
                this.refreshData(); 
              }
            });
        },
        reject: () => { }
      });
    }
  }

  /// Reset Product Master Form
  resetForm() {
    this.product.id = 0;
    this.product.name = '';
    this.formType = 'Add New';
  }

  /// Refresh Product Master
  refreshData() {
    this.getProducts();
    this.close.nativeElement.click();
    this.resetForm();
  }





  ///  Filter logic starts
  public getFilterValue(column: IgxColumnComponent): any {
    return this._filterValues.has(column) ? this._filterValues.get(column) : null;
  }

  public onInput(input: any, column: IgxColumnComponent) {
    this._filterValues.set(column, input.value);

    if (input.value === "") {
      this.grid1.clearFilter(column.field);
      return;
    }

    let operand = null;
    switch (column.dataType) {
      case DataType.Number:
        operand = IgxNumberFilteringOperand.instance().condition("equals");
        break;
      default:
        operand = IgxStringFilteringOperand.instance().condition("contains");
    }
    this.grid1.filter(column.field, this.transformValue(input.value, column), operand, column.filteringIgnoreCase);
  }

  public clearInput(column: IgxColumnComponent) {
    this._filterValues.delete(column);
    this.grid1.clearFilter(column.field);
  }

  private transformValue(value: any, column: IgxColumnComponent): any {
    if (column.dataType === DataType.Number) {
      value = parseFloat(value);
    }
    return value;
  }
  ///  Filter logic ends



}


