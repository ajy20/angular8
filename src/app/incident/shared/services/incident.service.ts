import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/shared/services/http.service';
import { RestApiIncidentData, Incident } from '../models/incident-details';
import { RestApi } from 'src/app/shared/class/rest-api';

@Injectable({
  providedIn: 'root'
})
export class IncidentService {

  incidentId: number = 0;

  constructor(
    private httpSvc: HttpService
  ) { }

  /// Get incident by Id
  getIncident() {
    return this.httpSvc.get<RestApiIncidentData>(RestApi.get_incident_by_id.format(this.incidentId));
  }
  



}
