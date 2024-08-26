import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: HttpClient) { }

  get<T>(uri: string): Observable<T> {
    let headers = new HttpHeaders();
    const options = {
      headers: headers
    };
    return this.http.get<T>(uri, options);
  }
  put(uri: string, inputData: any): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    const options = {
      headers: headers
    };
    return this.http.put(uri, inputData, options)
      .pipe(
        catchError(this.handleError)
      );
  }
  patch(uri: string, inputData: any): Observable<any> {
    return this.http.patch(uri, inputData)
      .pipe(
        catchError(this.handleError)
      );
  }
  post(uri: string, inputData: any): Observable<any> {
    return this.http.post(uri, inputData).pipe(
      catchError(this.handleError)
    );
  }
  delete(uri: string): Observable<any> {
    //const url = `${uri}/${id}`;
    return this.http.delete(uri)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    if (error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      // this.logger.error(error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      // this.logger.error(`Backend returned code ${error.status}, ` +
      //   `body was: ${error.message}`);
    }
    // return an ErrorObservable with a user-facing error message
    //return ErrorObservable.create(error);
    return throwError(error);
  }

}
