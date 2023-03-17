import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-form-input',
  templateUrl: './form-input.component.html',
  styleUrls: ['./form-input.component.scss']
})
export class FormInputComponent {
  @Input()
  formGroup!: FormGroup

  @Input()
  inputType!: string

  @Input()
  controlName!: string

  @Input()
  placeholder: string = this.controlName
}
