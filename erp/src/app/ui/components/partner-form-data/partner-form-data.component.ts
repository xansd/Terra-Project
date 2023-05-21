import { Component } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-partner-form-data',
  templateUrl: './partner-form-data.component.html',
  styleUrls: ['./partner-form-data.component.scss'],
})
export class PartnerFormDataComponent {
  active = true;
  constructor(private formBuilder: UntypedFormBuilder) {}
  createPartnerForm: UntypedFormGroup = this.formBuilder.group({
    email: [null, [Validators.required, Validators.email]],
    rol: [null, Validators.required],
  });
}
