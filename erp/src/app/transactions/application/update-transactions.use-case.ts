import { Inject, Injectable } from '@angular/core';
import { ITransactions } from '../domain/transactions';
import { ITransactionsRepository } from '../domain/transactions.repository';
import { Observable } from 'rxjs';

export interface IUpdateTransactions {
  create(transaction: ITransactions): Observable<ITransactions>;
  delete(id: string): Observable<void>;
}
Injectable({
  providedIn: 'root',
});
export class UpdateTransactions implements IUpdateTransactions {
  constructor(
    @Inject('transactionsAPI')
    private readonly transactionsAPI: ITransactionsRepository
  ) {}
  create(transaction: ITransactions): Observable<ITransactions> {
    return this.transactionsAPI.create(transaction);
  }
  delete(id: string): Observable<void> {
    return this.transactionsAPI.delete(id);
  }
}
