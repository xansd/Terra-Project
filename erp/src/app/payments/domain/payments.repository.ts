import { Observable } from 'rxjs';
import { IAccount, IPayments, PaymentType } from './payments';

export interface IPaymentsRepository {
  getById(id: string): Observable<IPayments>;
  getAccountById(id: string): Observable<IAccount>;
  getAllAccounts(): Observable<IAccount[]>;
  getAllByType(type: PaymentType): Observable<IPayments[]>;
  getAllByReference(referenceId: string): Observable<IPayments[]>;
  create(payment: IPayments): Observable<IPayments>;
  delete(id: string): Observable<void>;
  updateAccountBalance(
    accountId: string,
    value: number,
    operation: PaymentType
  ): Observable<void>;
}
