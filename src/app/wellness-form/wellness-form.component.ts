import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IntervalsClient } from 'infrastructure/intervals.client';
import * as moment from 'moment';
import { ConfigurationService } from 'infrastructure/configuration.service';
import { ConfigurationData } from '../../infrastructure/configuration-data';


const DATE_FORMAT = 'YYYY-MM-DD';
const TODAY_DATE = moment();

@Component({
  selector: 'app-wellness-form',
  templateUrl: './wellness-form.component.html',
  styleUrls: ['./wellness-form.component.scss']
})
export class WellnessFormComponent implements OnInit {

  formControls = [
    {controlName: 'weight', type: 'number'},
    {controlName: 'restingHR', type: 'number'},
    {controlName: 'hrv', type: 'number'},
    {controlName: 'hrvSDNN', type: 'number'},
    {controlName: 'comments', type: 'textarea'}
  ];

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
    this.configurationData = this.configurationService.getConfiguration()
    this.wellnessForm = this.getWellnessForm()
    this.wellnessForm.controls['date'].valueChanges.subscribe(date => {
      this.setWellnessFormValues(date);
    });

    this.wellnessForm.patchValue({
      date: TODAY_DATE,
    });
  }


  onSubmit(): void {
    this.sendingInProgress = true;
    let date = this.wellnessForm.value.date;
    let values = this.getWellnessValues(date, this.wellnessForm);

    console.log(values);

    this.intervalsClient.updateWellness(this.configurationData.athleteId!, date, values).subscribe(() => {
      console.log('done');
      this.sendingInProgress = false;
    });
  }

  private getWellnessValues(date: string, form: FormGroup): any {
    let values: any = {
      id: date
    };

    Object.keys(form.controls).forEach(controlName => {
      let control = form.controls[controlName]
      if (control.dirty) {
        values[controlName] = control.value === null ? -1 : control.value
      }
    })
    return values;
  }

  private setWellnessFormValues(date: any) {
    this.intervalsClient.getWellness(this.configurationData.athleteId!, date.format(DATE_FORMAT)).subscribe((response) => {
      let newValues: any = {
        date: response.id
      };

      this.formControls.forEach(key => {
        newValues[key.controlName] = response[key.controlName];
      });

      this.wellnessForm.setValue(newValues, {emitEvent: false});
    });
  }

  private getWellnessForm(): FormGroup {
    let wellnessFormFields: any = {
      date: [null, Validators.required],
    };
    this.formControls.forEach(key => {
      wellnessFormFields[key.controlName] = null;
    });

    return this.formBuilder.group(wellnessFormFields);
  }
}
