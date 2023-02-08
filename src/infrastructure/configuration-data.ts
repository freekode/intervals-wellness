export class ConfigurationData {
  athleteId?: string;
  apiKey?: string;

  constructor(athleteId?: string, apiKey?: string) {
    this.athleteId = athleteId
    this.apiKey = apiKey
  }

  isFull(): boolean {
    return !!this.athleteId && !!this
  }
}