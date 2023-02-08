import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class IntervalsClient {

  HOSTNAME = 'https://intervals.icu'

  constructor(private httpClient: HttpClient) { }

  test(athleteId: string): Observable<any> {
    return this.httpClient
      .get(`${this.HOSTNAME}/api/v1/athlete/${athleteId}/calendars`)
  }

  getWellness(athleteId: string, date: string): Observable<any> {
    return this.httpClient
      .get(`${this.HOSTNAME}/api/v1/athlete/${athleteId}/wellness/${date}`)
  }
  
  updateWellness(athleteId: string, date: string, values: any): Observable<any> {
    return this.httpClient
      .put(`${this.HOSTNAME}/api/v1/athlete/${athleteId}/wellness?localDate=${date}`, values)
  }

  getStreams(activityId: string, streams: Array<string>): Observable<any> {
    var params = new HttpParams({
      fromObject: {
        types: streams
      }
    });

    return this.httpClient
      .get(`${this.HOSTNAME}/api/v1/activity/${activityId}/streams`, { params })
  }
}
