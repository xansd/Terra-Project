import { Injectable } from '@angular/core';
import { FormGroup, UntypedFormGroup } from '@angular/forms';
import { AppStateService, FormMode } from '../../services/app-state.service';
import { IPartner } from 'src/app/partners/domain/partner';
import { Email } from 'src/app/shared/domain/value-objects/email.value-object';

@Injectable({
  providedIn: 'root',
})
export class FormsHelperService {
  constructor(private appState: AppStateService) {}

  getInvalidFields(form: FormGroup): any {
    const invalidFields = [];
    for (const fieldName in form.controls) {
      if (form.controls[fieldName].invalid) {
        invalidFields.push(fieldName);
      }
    }

    if (invalidFields.length > 0) {
      const errorFields = invalidFields
        .map((fieldName, index) => {
          if (index === invalidFields.length - 1) {
            return fieldName;
          }
          return fieldName + ',';
        })
        .join(' ');

      return `Campos inválidos: ${JSON.stringify(invalidFields)}`;
    }
  }

  initFormCreateMode() {
    this.appState.state.formMode = FormMode.CREATE;
  }

  initFormUpdateMode() {
    this.appState.state.formMode = FormMode.UPDATE;
  }

  clearFormMeta() {
    this.appState.state.formMode = FormMode.SLEEP;
  }

  createPartnerFormData(
    form: UntypedFormGroup,
    mode: FormMode,
    user: string,
    partnerId?: string
  ): IPartner {
    const formValues = form.value;
    const id = partnerId ? partnerId : undefined;
    const partnerData: IPartner = {
      name: formValues.name,
      surname: formValues.surname,
      dni: formValues.dni,
      email: Email.create(formValues.email),
      phone: formValues.phone,
      address: formValues.address,
      birthday: formValues.birth,
      cannabis_month: formValues.cannabis,
      hash_month: formValues.hash,
      extractions_month: formValues.extractions,
      others_month: formValues.others,
      partner_type_id:
        mode === FormMode.CREATE
          ? formValues.type
          : formValues.type.partner_type_id,
      active: formValues.active,
      therapeutic: formValues.therapeutic,
      fee: formValues.fee,
      inscription: formValues.inscription,
    };

    if (mode === FormMode.CREATE) {
      partnerData.user_created = user;
    } else if (FormMode.UPDATE) {
      partnerData.user_updated = user;
    }

    if (id) {
      partnerData.partner_id = id;
    }

    return partnerData;
  }
}
