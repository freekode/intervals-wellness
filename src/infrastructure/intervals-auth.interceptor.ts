import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfigurationService } from './configuration.service';

const INTERVALS_LOGIN = 'API_KEY';

@Injectable()
export class IntervalsAuthInterceptor implements HttpInterceptor {

  constructor(private configurationService: ConfigurationService) {
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(this.addBasicAuth(request));
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
}
