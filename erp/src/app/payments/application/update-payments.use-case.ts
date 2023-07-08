import { Observable } from 'rxjs';
import { IPayments } from '../domain/payments';
import { IPaymentsRepository } from '../domain/payments.repository';
import { Inject, Injectable } from '@angular/core';

export interface IUpdatePayments {
  create(payment: IPayments): Observable<IPayments>;
  delete(id: string): Observable<void>;
}

@Injectable({
  providedIn: 'root',
})
export class UpdatePayments implements IUpdatePayments {
  constructor(
    @Inject('paymentsAPI') private readonly paymentsAPI: IPaymentsRepository
  ) {}
  create(payment: IPayments): Observable<IPayments> {
    return this.paymentsAPI.create(payment);
  }

  delete(id: string): Observable<void> {
    return this.paymentsAPI.delete(id);
  }
}
