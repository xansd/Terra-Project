import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AppStateService, FormMode } from '../../services/app-state.service';

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
    this.appState.state.activeEntityID = '';
  }
}
