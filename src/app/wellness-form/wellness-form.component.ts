import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { IntervalsClient } from 'infrastructure/intervals.client';
import * as moment from 'moment';
import { ConfigurationService } from 'infrastructure/configuration.service';
import { ConfigurationData } from 'infrastructure/configuration-data';
import { WellnessField } from './WellnessField';
import { WellnessFieldService } from './wellness-field.service';
import { catchError, EMPTY } from 'rxjs';


const DATE_FORMAT = 'YYYY-MM-DD';

@Component({
  selector: 'app-wellness-form',
  templateUrl: './wellness-form.component.html',
  styleUrls: ['./wellness-form.component.scss'],
})
export class WellnessFormComponent implements OnInit {

  wellnessFields!: WellnessField[];
  unsupportedWellnessFields!: WellnessField[];

  formGroup!: FormGroup;

  configurationData!: ConfigurationData;

  selectedDate: any = moment();

  requestInProgress = false;
  requestSuccessful = false;
  requestError = false;
  errorMessage: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private intervalsClient: IntervalsClient,
    private configurationService: ConfigurationService,
  ) {
  }

  ngOnInit(): void {
    this.requestInProgress = true;
    this.configurationData = this.configurationService.getConfiguration();
    this.intervalsClient.getAthlete(this.configurationData.athleteId!).pipe(
      catchError(err => {
        this.errorMessage = err.error.error;
        return EMPTY;
      })
    ).subscribe({
      next: response => {
        const wellnessFieldService = new WellnessFieldService(response['icu_wellness_keys']);
        this.wellnessFields = wellnessFieldService.supportedFields;
        this.unsupportedWellnessFields = wellnessFieldService.unsupportedFields;
        this.formGroup = this.getWellnessFormGroup(this.wellnessFields);
        this.setWellnessFormValues(this.selectedDate);
      },
      complete: () => {
        this.requestInProgress = false;
      }
    });
  }

  onSubmit(): void {
    if (this.formGroup.pristine) {
      return;
    }
    this.requestInProgress = true;
    this.errorMessage = '';
    let values = this.getWellnessFormValues(this.formGroup);

    console.log(values);

    this.intervalsClient.updateWellness(this.configurationData.athleteId!, values.id, values).pipe(
      catchError(err => {
        if (err.status === 422) {
          this.showErrorIcon();
          this.errorMessage = err.error.error;
        }
        return EMPTY;
      })
    ).subscribe({
      next: response => {
        console.log('done');
        this.fillWellnessForm(response);
        this.showSuccessfulIcon();
      },
      complete: () => {
        this.requestInProgress = false;
      }
    });
  }

  onDateChanged($event: any) {
    this.selectedDate = $event.value;
    this.setWellnessFormValues($event.value);
  }

  private getWellnessFormValues(form: FormGroup): any {
    let values: any = {
      id: this.selectedDate.format(DATE_FORMAT)
    };

    Object.keys(form.controls).forEach(controlName => {
      let control = form.controls[controlName];
      if (control.dirty) {
        values[controlName] = this.parseFormValue(control.value, controlName);
      }
    });
    return values;
  }

  private setWellnessFormValues(date: any) {
    this.intervalsClient.getWellness(this.configurationData.athleteId!, date.format(DATE_FORMAT)).subscribe((response) => {
      this.fillWellnessForm(response);
    });
  }

  private fillWellnessForm(data: any) {
    let newValues: any = {};
    Object.keys(this.formGroup.controls).forEach(controlName => {
      newValues[controlName] = data[controlName];
    });

    this.formGroup.reset(newValues, {emitEvent: false});
  }

  private getWellnessFormGroup(wellnessFormControls: WellnessField[]): FormGroup {
    let wellnessFormFields: any = {};
    wellnessFormControls.forEach((field: any) => {
      wellnessFormFields[field.key] = [null, field.validators];
    });

    return this.formBuilder.group(wellnessFormFields);
  }

  private parseFormValue(value: any, controlName: string) {
    let wellnessField = this.wellnessFields.find(elem => elem.key === controlName);
    if (wellnessField!.type === 'number') {
      if (!value) {
        value = -1;
      } else {
        value = (value + '').replace(',', '.');
      }
    }
    return value;
  }

  private showSuccessfulIcon() {
    this.requestSuccessful = true;
    setTimeout(() => {
      this.requestSuccessful = false;
    }, 5000);
  }

  private showErrorIcon() {
    this.requestError = true;
    setTimeout(() => {
      this.requestError = false;
    }, 5000);
  }

}
