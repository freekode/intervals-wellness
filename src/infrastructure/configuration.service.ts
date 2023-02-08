import { Injectable } from '@angular/core';
import { ConfigurationData } from './configuration-data';


@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {

  getConfiguration(): ConfigurationData {
    return new ConfigurationData(
      localStorage.getItem('athleteId')?.toString(),
      localStorage.getItem('apiKey')?.toString()
    )
  }

  setConfiguration(data: ConfigurationData): void {
    localStorage.setItem('athleteId', data.athleteId!)
    localStorage.setItem('apiKey', data.apiKey!)
  }

}
