import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IntervalsClient } from 'infrastructure/intervals.client';
import * as moment from 'moment';
import { ConfigurationService } from 'infrastructure/configuration.service';
import { ConfigurationData } from '../../infrastructure/configuration-data';


const DATE_FORMAT = 'YYYY-MM-DD';
const TODAY_DATE = moment();
const KNOWN_FORM_CONTROLS = [
  {controlName: 'weight', type: 'number'},
  {controlName: 'restingHR', type: 'number'},
  {controlName: 'hrv', type: 'number'},
  {controlName: 'hrvSDNN', type: 'number'},
  {controlName: 'comments', type: 'textarea'}
];

@Component({
  selector: 'app-wellness-form',
  templateUrl: './wellness-form.component.html',
  styleUrls: ['./wellness-form.component.scss']
})
export class WellnessFormComponent implements OnInit {

  formControls!: Array<any>;

  wellnessForm!: FormGroup;

  configurationData!: ConfigurationData;

  sendingInProgress = false;

  constructor(
    private formBuilder: FormBuilder,
    private intervalsClient: IntervalsClient,
    private configurationService: ConfigurationService
  ) {
  }

  ngOnInit(): void {
    this.configurationData = this.configurationService.getConfiguration();
    this.intervalsClient.getAthlete(this.configurationData.athleteId!).subscribe(response => {
      this.formControls = this.getWellnessControls(response);
      this.wellnessForm = this.getWellnessFormGroup(this.formControls);

      this.handleDateChange();
    });
  }

  onSubmit(): void {
    this.sendingInProgress = true;
    let values = this.getWellnessFormValues(this.wellnessForm);

    console.log(values);

    this.intervalsClient.updateWellness(this.configurationData.athleteId!, values.id, values).subscribe(() => {
      console.log('done');
      this.sendingInProgress = false;
    });
  }

  private handleDateChange() {
    this.wellnessForm.controls['id'].valueChanges.subscribe(date => {
      this.setWellnessFormValues(date);
    });
    this.wellnessForm.patchValue({
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

      this.formControls.forEach((key: any) => {
        newValues[key.controlName] = response[key.controlName];
      });

      this.wellnessForm.setValue(newValues, {emitEvent: false});
      this.sendingInProgress = false;
    });
  }

  private getWellnessControls(response: any) {
    let wellnessKeys = response['icu_wellness_keys'] as Array<string>;
    return KNOWN_FORM_CONTROLS.filter(elem => wellnessKeys.indexOf(elem.controlName) > -1);
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
}
