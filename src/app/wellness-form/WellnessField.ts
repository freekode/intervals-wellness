import { ValidatorFn } from '@angular/forms';

export class WellnessField {
  key: string;
  type: string;
  title: string;
  validators: ValidatorFn[]

  constructor(key: string, type: string, title: string, validators?: ValidatorFn[]) {
    this.key = key;
    this.type = type;
    this.title = title;
    this.validators = validators || []
  }
}
