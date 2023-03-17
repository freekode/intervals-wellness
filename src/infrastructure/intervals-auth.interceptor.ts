import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { catchError, Observable, of, throwError } from 'rxjs';
import { ConfigurationService } from './configuration.service';

const INTERVALS_LOGIN = 'API_KEY';

@Injectable()
export class IntervalsAuthInterceptor implements HttpInterceptor {

  constructor(private configurationService: ConfigurationService) {
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(this.addBasicAuth(request)).pipe(
      catchError(e => this.handleAuthError(e))
    );
  }

  private addBasicAuth(request: HttpRequest<unknown>) {
    let configurationData = this.configurationService.getConfiguration();
    let token = btoa(`${INTERVALS_LOGIN}:${configurationData.apiKey!}`);

    return request.clone({
      setHeaders: {
        Authorization: `Basic ${token}`
      }
    });
  }

  private handleAuthError(response: HttpErrorResponse): Observable<any> {
    if (response.status === 401 || response.status === 403) {
      return of(response.message);
    }
    return throwError(() => new Error(response.message));
  }

}
