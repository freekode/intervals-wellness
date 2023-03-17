import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IntervalsClient } from 'infrastructure/intervals.client';
import * as moment from 'moment';
import { ConfigurationService } from 'infrastructure/configuration.service';
import { ConfigurationData } from 'infrastructure/configuration-data';


const DATE_FORMAT = 'YYYY-MM-DD';
const TODAY_DATE = moment();
const KNOWN_WELLNESS_FIELDS = [
  {controlName: 'weight', type: 'number'},
  {controlName: 'restingHR', type: 'number'},
  {controlName: 'hrv', type: 'number'},
  {controlName: 'hrvSDNN', type: 'number'},
  {controlName: 'comments', type: 'textarea'}
];

@Component({
  selector: 'app-wellness-form',
  templateUrl: './wellness-form.component.html',
  styleUrls: ['./wellness-form.component.scss'],
})
export class WellnessFormComponent implements OnInit {

  wellnessFields!: Array<any>;

  formGroup!: FormGroup;

  configurationData!: ConfigurationData;

  sendingInProgress = false;
  requestSuccessful = false;
  requestError = false;

  constructor(
    private formBuilder: FormBuilder,
    private intervalsClient: IntervalsClient,
    private configurationService: ConfigurationService
  ) {
  }

  ngOnInit(): void {
    this.configurationData = this.configurationService.getConfiguration();
    this.intervalsClient.getAthlete(this.configurationData.athleteId!).subscribe(response => {
      this.wellnessFields = this.getWellnessFields(response);
      this.formGroup = this.getWellnessFormGroup(this.wellnessFields);

      this.handleDateChange();
    });
  }

  onSubmit(): void {
    if (this.formGroup.pristine) {
      return;
    }
    this.sendingInProgress = true;
    let values = this.getWellnessFormValues(this.formGroup);

    console.log(values);

    this.intervalsClient.updateWellness(this.configurationData.athleteId!, values.id, values).subscribe(() => {
      console.log('done');
      this.sendingInProgress = false;
      this.showSuccessfulIcon();
    });
  }

  private handleDateChange() {
    this.formGroup.controls['id'].valueChanges.subscribe(date => {
      this.setWellnessFormValues(date);
    });
    this.formGroup.patchValue({
      id: TODAY_DATE,
    });
  }

  private getWellnessFormValues(form: FormGroup): any {
    let values: any = {
      id: form.controls['id'].value
    };

    Object.keys(form.controls).forEach(controlName => {
      let control = form.controls[controlName];
      if (control.dirty) {
        values[controlName] = control.value === null ? -1 : control.value;
      }
    });
    return values;
  }

  private setWellnessFormValues(date: any) {
    this.sendingInProgress = true;
    this.intervalsClient.getWellness(this.configurationData.athleteId!, date.format(DATE_FORMAT)).subscribe((response) => {
      let newValues: any = {
        id: response.id
      };

      this.wellnessFields.forEach((key: any) => {
        newValues[key.controlName] = response[key.controlName];
      });

      this.formGroup.setValue(newValues, {emitEvent: false});
      this.sendingInProgress = false;
    });
  }

  private getWellnessFields(response: any) {
    let wellnessKeys = response['icu_wellness_keys'] as Array<string>;
    return KNOWN_WELLNESS_FIELDS.filter(elem => wellnessKeys.indexOf(elem.controlName) > -1);
  }

  private getWellnessFormGroup(wellnessFormControls: any): FormGroup {
    let wellnessFormFields: any = {
      id: [null, Validators.required],
    };
    wellnessFormControls.forEach((key: any) => {
      wellnessFormFields[key.controlName] = null;
    });

    return this.formBuilder.group(wellnessFormFields);
  }

  private showSuccessfulIcon() {
    this.requestSuccessful = true;
    setTimeout(() => {
      this.requestSuccessful = false;
    }, 5000);
  }
}
