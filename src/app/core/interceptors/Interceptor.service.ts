import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
    HttpResponse,
    HttpErrorResponse,
    HttpHeaderResponse
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import { NgxSpinnerService } from "ngx-spinner";


@Injectable()
export class Interceptor implements HttpInterceptor {
    count: number = 0;
    constructor(
        private _router: Router, 
        public auth: AuthService,
        private _spinner: NgxSpinnerService
        ) { }
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any> | HttpResponse<any> | HttpHeaderResponse> {
        this._spinner.show();
        this.count++;
        request = request.clone({
            setHeaders: {
                Authorization: `Bearer ${this.auth.getToken()}`
            }
        });
        return next.handle(request)
            .pipe(
                finalize(() => {
                    this.count--;
                    if (this.count == 0)
                        this._spinner.hide();                        
                })
            );
    }
}
