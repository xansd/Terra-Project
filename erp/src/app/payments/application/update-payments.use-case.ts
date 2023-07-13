import { Observable } from 'rxjs';
import { IPayments, PaymentType } from '../domain/payments';
import { IPaymentsRepository } from '../domain/payments.repository';
import { Inject, Injectable } from '@angular/core';
import { InvalidAmountError, MinZeroError } from '../domain/payments.exception';

export interface IUpdatePayments {
  create(payment: IPayments): Observable<IPayments>;
  updateAccountBalance(
    accountId: string,
    value: number,
    operation: PaymentType
  ): Observable<void>;
  delete(id: string): Observable<void>;
}

@Injectable({
  providedIn: 'root',
})
export class UpdatePayments implements IUpdatePayments {
  constructor(
    @Inject('paymentsAPI') private readonly paymentsAPI: IPaymentsRepository
  ) {}
  updateAccountBalance(
    accountId: string,
    value: number,
    operation: PaymentType
  ): Observable<void> {
    if (value < 0) throw new MinZeroError();
    if (isNaN(value)) throw new InvalidAmountError();
    return this.paymentsAPI.updateAccountBalance(accountId, value, operation);
  }
  create(payment: IPayments): Observable<IPayments> {
    return this.paymentsAPI.create(payment);
  }

  delete(id: string): Observable<void> {
    return this.paymentsAPI.delete(id);
  }
}
