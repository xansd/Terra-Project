import { Injectable } from '@angular/core';
import { FormGroup, UntypedFormGroup } from '@angular/forms';
import { AppStateService, FormMode } from '../../services/app-state.service';
import { IPartner } from 'src/app/partners/domain/partner';
import { Email } from 'src/app/shared/domain/value-objects/email.value-object';
import {
  ICategories,
  IProduct,
  ISubcategories,
  ProductsType,
} from 'src/app/products/domain/products';

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
      cash: formValues.cash,
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

  createProductFormData(
    form: UntypedFormGroup,
    mode: FormMode,
    user: string,
    selectedCategory: ICategories,
    productId?: string
  ): IProduct {
    const formValues = form.value;
    const id = productId ? productId : undefined;
    const productData: IProduct = {
      name: formValues.name,
      type: selectedCategory.type,
      category_id: formValues.category_id,
      subcategories: this.getSubcategories(formValues.subcategories),
      description: formValues.description,
    };

    if (selectedCategory.type === ProductsType.MANCOMUNADOS) {
      productData.sativa = formValues.sativa;
      productData.indica = formValues.indica;
      productData.thc = formValues.thc;
      productData.cbd = formValues.cbd;
      productData.bank = formValues.bank;
      productData.flawour = formValues.flawour;
      productData.effect = formValues.effect;
      productData.ancestors = this.getAncestors(formValues.ancestors);
    } else if (selectedCategory.type === ProductsType.TERCEROS) {
      productData.cost_price = formValues.cost_price;
      productData.sale_price = formValues.sale_price;
    }

    if (mode === FormMode.CREATE) {
      productData.user_created = user;
    } else if (FormMode.UPDATE) {
      productData.user_updated = user;
    }

    if (id) {
      productData.product_id = id;
    }

    return productData;
  }

  getSubcategories(formValues: any): string[] {
    if (!formValues || formValues.length === 0) return [];
    let subcategories: string[] = [];
    for (const i of formValues) {
      subcategories.push(i);
    }
    return subcategories;
  }

  getAncestors(formValues: any): string[] {
    if (!formValues || formValues.length === 0) return [];
    let ancestors: string[] = [];
    for (const i of formValues) {
      ancestors.push(i);
    }
    return ancestors;
  }
}
