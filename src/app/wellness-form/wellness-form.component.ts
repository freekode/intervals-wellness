import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IntervalsClient } from 'infrastructure/intervals.client';
import * as moment from 'moment';
import { ConfigurationService } from 'infrastructure/configuration.service';


const DATE_FORMAT = 'YYYY-MM-DD';
const TODAY_DATE = moment();

@Component({
  selector: 'app-wellness-form',
  templateUrl: './wellness-form.component.html',
  styleUrls: ['./wellness-form.component.scss']
})
export class WellnessFormComponent implements OnInit {

  wellnessForm!: FormGroup;

  configurationData = this.configurationService.getConfiguration();

  formControls = [
    {controlName: 'weight', type: 'number'},
    {controlName: 'restingHR', type: 'number'},
    {controlName: 'hrv', type: 'number'},
    {controlName: 'hrvSDNN', type: 'number'},
    {controlName: 'comments', type: 'textarea'}
  ];

  sendingInProgress = false;

  constructor(
    private formBuilder: FormBuilder,
    private intervalsClient: IntervalsClient,
    private configurationService: ConfigurationService
  ) {
  }

  ngOnInit(): void {
    this.wellnessForm = this.getWellnessForm()
    this.wellnessForm.controls['date'].valueChanges.subscribe(date => {
      this.updateWellnessForm(date);
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

  private updateWellnessForm(date: any) {
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

  private getWellnessValues(date: string, form: FormGroup): any {
    let values: any = {
      id: date
    };

    this.formControls.forEach(key => {
      values[key.controlName] = form.value[key.controlName];
    });
    return values;
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
