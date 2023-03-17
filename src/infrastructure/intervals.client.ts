import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
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

  getAthlete(athleteId: string): Observable<any> {
    return this.httpClient
      .get(`${this.HOSTNAME}/api/v1/athlete/${athleteId}`)
  }

  getWellness(athleteId: string, date: string): Observable<any> {
    return this.httpClient
      .get(`${this.HOSTNAME}/api/v1/athlete/${athleteId}/wellness/${date}`)
  }

  updateWellness(athleteId: string, date: string, values: any): Observable<any> {
    return this.httpClient
      .put(`${this.HOSTNAME}/api/v1/athlete/${athleteId}/wellness?localDate=${date}`, values)
  }
}
