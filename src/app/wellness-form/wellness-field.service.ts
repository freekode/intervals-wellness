import { WellnessField } from './WellnessField';
import { Validators } from '@angular/forms';

const INTEGER_VALIDATOR = Validators.pattern('^[0-9]*$');
const DOUBLE_VALIDATOR = Validators.pattern('^[0-9]*[.,]?[0-9]*$');
const MIN_NUM_VALIDATOR = Validators.min(20);


const SUPPORTED_WELLNESS_FIELDS: WellnessField[] = [
  new WellnessField('weight', 'number', 'Weight', [MIN_NUM_VALIDATOR]),
  new WellnessField('restingHR', 'number', 'RHR', [INTEGER_VALIDATOR, MIN_NUM_VALIDATOR]),
  new WellnessField('hrv', 'number', 'HRV (RMSSD)', [DOUBLE_VALIDATOR]),
  new WellnessField('hrvSDNN', 'number', 'HRV (SDNN)', [DOUBLE_VALIDATOR]),
  new WellnessField('kcalConsumed', 'number', 'kCal Consumed'),
  new WellnessField('spO2', 'number', 'Sp02'),
  // new WellnessField('sleep', 'number', 'Sleep'),
  new WellnessField('sleepScore', 'number', 'Sleep Score'),
  new WellnessField('avgSleepingHR', 'number', 'Avg Sleeping HR', [INTEGER_VALIDATOR, MIN_NUM_VALIDATOR]),
  new WellnessField('readiness', 'number', 'Readiness'),
  new WellnessField('baevskySI', 'number', 'Baevsky SI'),
  new WellnessField('bloodGlucose', 'number', 'Blood Glucose'),
  new WellnessField('lactate', 'number', 'Lactate'),
  new WellnessField('hydrationVolume', 'number', 'Hydration (L)'),
  new WellnessField('bodyFat', 'number', 'Body Fat'),
  new WellnessField('abdomen', 'number', 'Abdomen (cm)', [Validators.min(30)]),
  new WellnessField('vo2max', 'number', 'VO2 Max', [DOUBLE_VALIDATOR]),
  new WellnessField('comments', 'textarea', 'Comments')
];

export class WellnessFieldService {
  readonly supportedFields: WellnessField[];

  readonly unsupportedFields: WellnessField[];

  constructor(icuWellnessKeys: string[]) {
    const {supportedFields, unsupportedFields} = this.getWellnessFields(icuWellnessKeys);
    this.supportedFields = supportedFields;
    this.unsupportedFields = unsupportedFields;
  }

  private getWellnessFields(icuWellnessKeys: string[]): any {
    let supportedFields: WellnessField[] = [];
    let unsupportedFields: WellnessField[] = [];
    SUPPORTED_WELLNESS_FIELDS.forEach(elem => {
      if (icuWellnessKeys.indexOf(elem.key) >= 0) {
        supportedFields.push(elem);
      } else {
        unsupportedFields.push(elem);
      }
    });

    return {supportedFields, unsupportedFields};
  }

}
