import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { IPayments, PaymentType } from '../domain/payments';
import { IPaymentsRepository } from '../domain/payments.repository';

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
}
