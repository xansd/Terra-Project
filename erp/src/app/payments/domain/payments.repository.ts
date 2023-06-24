import { Observable } from 'rxjs';
import { IPayments, PaymentType } from './payments';

export interface IPaymentsRepository {
  getById(id: string): Observable<IPayments>;
  getAllByType(type: PaymentType): Observable<IPayments[]>;
  getAllByReference(referenceId: string): Observable<IPayments[]>;
  create(payment: IPayments): Observable<IPayments>;
  delete(id: string): Observable<void>;
}
