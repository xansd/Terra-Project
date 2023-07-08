import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { IPayments, PaymentType } from '../domain/payments';
import { IPaymentsRepository } from '../domain/payments.repository';
import { IHarvests } from 'src/app/purchases/domain/harvests';
import { IPurchase } from 'src/app/purchases/domain/purchases';
import { InvalidAmountError } from '../domain/payments.exception';

export interface IGetPayments {
  getById(id: string): Observable<IPayments>;
  getAllByType(type: PaymentType): Observable<IPayments[]>;
  getAllByReference(referenceId: string): Observable<IPayments[]>;
}

@Injectable({
  providedIn: 'root',
})
export class GetPayments implements IGetPayments {
  constructor(
    @Inject('paymentsAPI') private readonly paymentsAPI: IPaymentsRepository
  ) {}

  getById(id: string): Observable<IPayments> {
    return this.paymentsAPI.getById(id);
  }
  getAllByType(type: PaymentType): Observable<IPayments[]> {
    return this.paymentsAPI.getAllByType(type);
  }
  getAllByReference(referenceId: string): Observable<IPayments[]> {
    return this.paymentsAPI.getAllByReference(referenceId);
  }

  getHarvestTotalPayment(harvest: IHarvests): number {
    const result = Number(harvest.cost_price) * Number(harvest.quantity);
    if (isNaN(result)) {
      throw new InvalidAmountError();
    }
    return result;
  }

  getPurchaseTotalPayment(purchase: IPurchase): number {
    return purchase.total_amount || 0;
  }

  getTotalPaid(payments: IPayments[]) {
    let paid = 0;
    for (const i of payments) {
      paid += Number(i.amount) || 0;
    }
    if (isNaN(paid)) {
      throw new InvalidAmountError();
    }
    return paid;
  }

  getTotalHarvestPending(harvest: IHarvests, payments?: IPayments[]) {
    const total = this.getHarvestTotalPayment(harvest);
    let paid: number = 0;
    if (payments) {
      paid = this.getTotalPaid(payments);
    } else paid = Number(harvest.paid);
    let result = Number(total) - Number(paid);
    if (isNaN(result)) {
      throw new InvalidAmountError();
    }
    if (result < 0) result = 0;
    return result;
  }

  getTotalPurchasePending(purchase: IPurchase, payments?: IPayments[]) {
    const total = this.getPurchaseTotalPayment(purchase);
    let paid: number = 0;
    if (payments) {
      paid = this.getTotalPaid(payments);
    } else paid = Number(purchase.paid);
    let result = Number(total) - Number(paid);
    if (isNaN(result)) {
      throw new InvalidAmountError();
    }
    if (result < 0) result = 0;
    return result;
  }
}
