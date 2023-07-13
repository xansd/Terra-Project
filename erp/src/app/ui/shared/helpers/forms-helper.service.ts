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
import { ISanctions } from 'src/app/partners/domain/sanctions';
import { IHarvests } from 'src/app/purchases/domain/harvests';
import { IProvider } from 'src/app/providers/domain/providers';
import { IPayments, PaymentType } from 'src/app/payments/domain/payments';
import { IPurchase } from 'src/app/purchases/domain/purchases';

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
      debt_limit: formValues.debt_limit,
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

  createSanctionFormData(
    form: UntypedFormGroup,
    partner: IPartner
  ): ISanctions {
    const formValues = form.value;
    const sanctionData: ISanctions = {
      partner_id: partner.partner_id!,
      severity: formValues.severity,
      description: formValues.description,
    };
    return sanctionData;
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
      active: formValues.active,
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
      productData.cost_price = formValues.cost_price || 0;
      productData.sale_price = formValues.sale_price || 0;
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

  createPaymentFormData(
    form: UntypedFormGroup,
    type: PaymentType,
    referenceId: string
  ): IPayments {
    const formValues = form.value;
    const paymentData: IPayments = {
      amount: formValues.amount,
      type: type,
      reference_id: referenceId,
      notes: formValues.notes || '',
      account_id: formValues.account_id || null,
    };

    return paymentData;
  }

  createHarvestFormData(form: UntypedFormGroup): IHarvests {
    const formValues = form.value;
    const harvestData: IHarvests = {
      provider_id: formValues.provider_id || '',
      product_id: formValues.product_id || '',
      cost_price: formValues.cost_price || 0,
      sale_price: formValues.sale_price || 0,
      fee_amount: formValues.fee_amount || 0,
      quantity: formValues.quantity || 0,
      notes: formValues.notes || '',
      stock: formValues.stock || 0,
      // manicured: formValues.manicured,
    };

    return harvestData;
  }

  createPurchaseFormData(form: UntypedFormGroup): IPurchase {
    const formValues = form.value;
    const harvestData: IPurchase = {
      provider_id: formValues.provider_id || '',
      total_amount: formValues.total_amount || 0,
      notes: formValues.notes || '',
      purchase_details: formValues.purchase_details,
    };

    return harvestData;
  }

  createProviderFormData(
    form: UntypedFormGroup,
    providerId?: string
  ): IProvider {
    const formValues = form.value;
    const id = providerId ? providerId : undefined;
    const providerData: IProvider = {
      name: formValues.name || '',
      email: Email.create(formValues.email) || '',
      phone: formValues.phone || '',
      address: formValues.address || '',
      type: ProductsType.TERCEROS,
    };

    if (id) {
      providerData.provider_id = id;
    }

    return providerData;
  }

  createCultivatorFormData(
    form: UntypedFormGroup,
    providerId?: string
  ): IProvider {
    const formValues = form.value;
    const id = providerId ? providerId : undefined;
    const providerData: IProvider = {
      name: formValues.name || '',
      email: Email.create(formValues.email) || '',
      phone: formValues.phone || '',
      address: formValues.address || '',
      type: ProductsType.MANCOMUNADOS,
    };

    if (id) {
      providerData.provider_id = id;
    }

    return providerData;
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
