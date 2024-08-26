import { Component, OnInit, ViewChild } from "@angular/core";
import {
  DataType,
  IgxColumnComponent,
  IgxGridComponent,
  IgxNumberFilteringOperand,
  IgxStringFilteringOperand
} from "igniteui-angular";
import { HttpClient } from '@angular/common/http';
import { Master, RestApiData } from 'src/app/models/master';
import { RestApi } from 'src/app/shared/class/rest-api';

@Component({
  selector: 'app-system',
  templateUrl: './system.component.html',
  styleUrls: ['./system.component.css']
})
export class SystemComponent implements OnInit {
  @ViewChild("grid1", { read: IgxGridComponent, static: true })
  public grid1: IgxGridComponent;
  private _filterValues = new Map<IgxColumnComponent, any>();
  systemLst: Master[];  

  constructor(
    private httpSvc:HttpClient
  ) { }
  
  public ngOnInit(): void {
    this.httpSvc.get<Master[]>(RestApi.lookup_master.format('system')).subscribe(data => {
      this.systemLst = data;
    });
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


