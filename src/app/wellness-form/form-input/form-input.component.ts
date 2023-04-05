import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { WellnessField } from '../WellnessField';

@Component({
  selector: 'app-form-input',
  templateUrl: './form-input.component.html',
  styleUrls: ['./form-input.component.scss']
})
export class FormInputComponent {
  @Input()
  formGroup!: FormGroup

  @Input()
  wellnessField!: WellnessField

}
