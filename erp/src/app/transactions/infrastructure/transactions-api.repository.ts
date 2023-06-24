import SERVER from '../../config/server.config';
import { Injectable } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ITransactions, TransactionCategoryType } from '../domain/transactions';
import { ITransactionsRepository } from '../domain/transactions.repository';
import {
  TransactionsMapper,
  ITransactionsDTO,
} from './transactions-dto.mapper';

const API_URI = SERVER.API_URI;

@Injectable({ providedIn: 'root' })
export class TransactionsAPIRepository implements ITransactionsRepository {
  private readonly transactionsMapper: TransactionsMapper;
  constructor(private http: HttpClient) {
    this.transactionsMapper = new TransactionsMapper();
  }
  getById(id: string): Observable<ITransactions> {
    return this.http
      .get<ITransactionsDTO>(`${API_URI}/transactions/${id}`, {
        withCredentials: true,
      })
      .pipe(
        map((purchase: ITransactionsDTO) =>
          this.transactionsMapper.toDomain(purchase)
        )
      );
  }

  getAllIncomes(): Observable<ITransactions[]> {
    return this.http
      .get<ITransactionsDTO[]>(`${API_URI}/transactions/all/incomes`, {
        withCredentials: true,
      })
      .pipe(
        map((TransactionsList: ITransactionsDTO[]) =>
          this.transactionsMapper.toDomainList(TransactionsList)
        )
      );
  }

  getAllExpenses(): Observable<ITransactions[]> {
    return this.http
      .get<ITransactionsDTO[]>(`${API_URI}/transactions/all/expenses`, {
        withCredentials: true,
      })
      .pipe(
        map((TransactionsList: ITransactionsDTO[]) =>
          this.transactionsMapper.toDomainList(TransactionsList)
        )
      );
  }

  getAllTransactionsByType(
    type: TransactionCategoryType
  ): Observable<ITransactions[]> {
    return this.http
      .get<ITransactionsDTO[]>(`${API_URI}/transactions/all/type/${type}`, {
        withCredentials: true,
      })
      .pipe(
        map((TransactionsList: ITransactionsDTO[]) =>
          this.transactionsMapper.toDomainList(TransactionsList)
        )
      );
  }

  create(purchase: ITransactions): Observable<ITransactions> {
    const TransactionsDTO = this.transactionsMapper.toDTO(purchase);
    return this.http.post<ITransactions>(
      `${API_URI}/transactions`,
      TransactionsDTO,
      {
        withCredentials: true,
      }
    );
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${API_URI}/transactions/${id}`, {
      withCredentials: true,
    });
  }
}
