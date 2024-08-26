import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { HttpService } from 'src/app/shared/services/http.service';
import { NumberValueAccessor } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class Internal8DResolver implements Resolve<any> {

  resolverData: StepD1Model[];   //Model Type

  constructor(private httpSvc: HttpService) { }

  /// function to fetch data of step
  resolve() {
    console.log("D1 Resolver called");
    
    // this.httpSvc.get<StepD1Model[]>('http://localhost:3015/gridData').subscribe(data => {
    //   this.resolverData = data;
    // });
    // return <StepD1Model[]>this.resolverData;
    return 1;
  }


}




export class StepD1Model {
  public id: number;
}
