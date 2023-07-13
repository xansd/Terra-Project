import { Observable } from 'rxjs';
import { ITransactions, TransactionCategoryType } from './transactions';

export interface ITransactionsRepository {
  getById(id: string): Observable<ITransactions>;
  getPartnerAccountTransactions(id: string): Observable<ITransactions[]>;
  getAllIncomes(): Observable<ITransactions[]>;
  getAllTransactions(): Observable<ITransactions[]>;
  getAllExpenses(): Observable<ITransactions[]>;
  getAllTransactionsByType(
    type: TransactionCategoryType
  ): Observable<ITransactions[]>;
  create(transaction: ITransactions): Observable<ITransactions>;
  delete(id: string): Observable<void>;
}
