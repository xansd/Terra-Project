import { Component, Input, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { IPartner } from 'src/app/partners/domain/partner';
import { ISanctions } from 'src/app/partners/domain/sanctions';

@Component({
  selector: 'app-sanctions',
  templateUrl: './sanctions.component.html',
  styleUrls: ['./sanctions.component.scss'],
})
export class SanctionsComponent implements OnInit {
  @Input('partner') partner!: IPartner;
  severities: string[] = ['Leve', 'Grave', 'Muy Grave'];
  sanctionForm: UntypedFormGroup = this.formBuilder.group({
    type: [this.severities[0], [Validators.required]],
    description: ['', [Validators.required]],
  });

  constructor(private formBuilder: UntypedFormBuilder) {}

  ngOnInit(): void {}

  addSanction() {
    console.log(this.sanctionForm);
    this.sanctionForm.get('description')?.setValue('');
  }

  deleteSanction(index: number) {}
}
