import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfigurationService } from './configuration.service';

const INTERVALS_LOGIN = 'API_KEY'


@Injectable()
export class IntervalsAuthInterceptor implements HttpInterceptor {

  configurationData = this.configurationService.getConfiguration()

  constructor(private configurationService: ConfigurationService) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(this.addBasicAuth(request));
  }

  private addBasicAuth(request: HttpRequest<unknown>) {
    var token = btoa(`${INTERVALS_LOGIN}:${this.configurationData.apiKey!}`)

    return request.clone({
      setHeaders: {
        Authorization: `Basic ${token}`
      }
    })
  }
}
