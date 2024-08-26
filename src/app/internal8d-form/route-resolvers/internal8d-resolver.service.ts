import { Injectable } from '@angular/core';
import { Resolve, Router } from '@angular/router';
import { HttpService } from 'src/app/shared/services/http.service';
import { RestApi } from 'src/app/shared/class/rest-api';
import { Internal8D, Internal8DRestApi } from '../shared/models/internal8D';
import { SidebarService } from 'src/app/shared/services/sidebar.service';

@Injectable({
  providedIn: 'root'
})
export class Internal8DResolver implements Resolve<Internal8D> {

  resolverData: Internal8D;
  incidentId: number;

  constructor(
    private httpSvc: HttpService,
    private router: Router,
    private sidebarSvc: SidebarService
  ) { }

  /// function to fetch data of step
  resolve() {

    this.incidentId = this.sidebarSvc.incidentId;

    this.httpSvc.get<Internal8DRestApi>(RestApi.get_internal_8d_by_incidentid.format(this.incidentId)).subscribe(
      internal8dData => {
        this.resolverData = internal8dData.contents;
      });
    return <Internal8D>this.resolverData;
  }


}


