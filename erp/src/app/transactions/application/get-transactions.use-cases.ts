import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ITransactions, TransactionCategoryType } from '../domain/transactions';
import { ITransactionsRepository } from '../domain/transactions.repository';

export interface IGetTransactions {
  getById(id: string): Observable<ITransactions>;
  getAllIncomes(): Observable<ITransactions[]>;
  getAllExpenses(): Observable<ITransactions[]>;
  getAllTransactionsByType(
    type: TransactionCategoryType
  ): Observable<ITransactions[]>;
}

@Injectable({
  providedIn: 'root',
})
export class GetTransactions implements IGetTransactions {
  constructor(
    @Inject('transactionsAPI')
    private readonly transactionsAPI: ITransactionsRepository
  ) {}
  getById(id: string): Observable<ITransactions> {
    return this.transactionsAPI.getById(id);
  }

  getPartnerAccountTransactions(id: string): Observable<ITransactions[]> {
    return this.transactionsAPI.getPartnerAccountTransactions(id);
  }
  getAllTransactions(): Observable<ITransactions[]> {
    return this.transactionsAPI.getAllTransactions();
  }
  getAllIncomes(): Observable<ITransactions[]> {
    return this.transactionsAPI.getAllIncomes();
  }
  getAllExpenses(): Observable<ITransactions[]> {
    return this.getAllExpenses();
  }
  getAllTransactionsByType(
    type: TransactionCategoryType
  ): Observable<ITransactions[]> {
    return this.transactionsAPI.getAllTransactionsByType(type);
  }
}
