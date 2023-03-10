import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfigurationService } from 'infrastructure/configuration.service';
import { ConfigurationData } from 'infrastructure/configuration-data';
import { Router } from '@angular/router';


@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.scss']
})
export class ConfigurationComponent {
  configurationForm: FormGroup = this.getConfigurationForm()

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private configurationService: ConfigurationService
  ) {
  }

  ngOnInit(): void {
    let configuration = this.configurationService.getConfiguration()

    this.configurationForm.setValue({
      athleteId: configuration.athleteId || null,
      apiKey: configuration.apiKey || null,
    })
  }


  onSubmit(): void {
    let newConfiguration = new ConfigurationData(
      this.configurationForm.value.athleteId,
      this.configurationForm.value.apiKey
    )

    this.configurationService.setConfiguration(newConfiguration)
    this.router.navigate(['/wellness']);
  }

  private getConfigurationForm(): FormGroup {
    return this.formBuilder.group({
      athleteId: [null, Validators.required],
      apiKey: [null, Validators.required],
    });
  }
}
