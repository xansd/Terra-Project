import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class FormsHelperService {
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
}
