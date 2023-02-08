import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IntervalsClient } from 'infrastructure/intervals.client';
import * as moment from 'moment';
import { ConfigurationService } from 'infrastructure/configuration.service';
import { ConfigurationData } from 'infrastructure/configuration-data';


const DATE_FORMAT = 'YYYY-MM-DD'
const WELLNESS_KEYS = ['weight', 'restingHR', 'hrv', 'hrvSDNN', 'comments']

@Component({
  selector: 'app-wellness-form',
  templateUrl: './wellness-form.component.html',
  styleUrls: ['./wellness-form.component.scss']
})
export class WellnessFormComponent implements OnInit {
  
  todayDate = moment()

  wellnessForm: FormGroup = this.getWellnessForm()

  configurationData = this.configurationService.getConfiguration()

  constructor(
    private formBuilder: FormBuilder,
    private intervalsClient: IntervalsClient,
    private configurationService: ConfigurationService
  ) {
  }

  ngOnInit(): void {
    this.wellnessForm.controls['date'].valueChanges.subscribe(date => {
      this.updateWellnessForm(date);
    })

    this.wellnessForm.patchValue({
      date: this.todayDate,
    })
  }


  onSubmit(): void {
    let date = this.getDate(this.wellnessForm)
    let values = this.getWellnessValues(date, this.wellnessForm)

    console.log(values)

    this.intervalsClient.updateWellness(this.configurationData.athleteId!, date, values).subscribe(() => {
      console.log('done')
    })
  }

  private updateWellnessForm(date: any) {
    this.intervalsClient.getWellness(this.configurationData.athleteId!, date.format(DATE_FORMAT)).subscribe((response) => {
      let newValues: any = {
        date: response.id
      };

      WELLNESS_KEYS.forEach(key => {
        newValues[key] = response[key];
      });

      this.wellnessForm.setValue(newValues, {emitEvent: false});
    })
  }

  private getWellnessValues(date: string, form: FormGroup): any {
    let values: any = {
      id: date
    }

    WELLNESS_KEYS.forEach(key => {
      values[key] = form.value[key];
    });
    return values
  }

  private getWellnessForm(): FormGroup {
    let wellnessFormFields: any = {
      date: [null, Validators.required],
    };
    WELLNESS_KEYS.forEach(key => {
      wellnessFormFields[key] = null;
    });

    return this.formBuilder.group(wellnessFormFields);
  }

  private getDate(form: FormGroup) {
    return form.value.date.format(DATE_FORMAT)
  }
}
