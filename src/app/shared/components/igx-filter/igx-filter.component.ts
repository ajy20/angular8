import { Component, OnInit, ViewChild } from '@angular/core';
import { IgxGridComponent, IgxColumnComponent } from 'igniteui-angular';

@Component({
  selector: 'app-igx-filter',
  templateUrl: './igx-filter.component.html',
  styleUrls: ['./igx-filter.component.css']
})
export class IgxFilterComponent implements OnInit {
  // @ViewChild("grid1", { read: IgxGridComponent, static: true })
  // public grid1: IgxGridComponent;
  // private _filterValues = new Map<IgxColumnComponent, any>();


  constructor() { }

  ngOnInit() {
  }

}
