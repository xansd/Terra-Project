import SERVER from '../../config/server.config';
import { Injectable } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { IPaymentsRepository } from '../domain/payments.repository';
import { IAccount, IPayments, PaymentType } from '../domain/payments';
import { IPaymentsDTO, PaymentMapper } from './payments-dto.mapper';

const API_URI = SERVER.API_URI;

@Injectable({ providedIn: 'root' })
export class PaymentsAPIRepository implements IPaymentsRepository {
  private readonly paymentsDTOMapper: PaymentMapper;
  constructor(private http: HttpClient) {
    this.paymentsDTOMapper = new PaymentMapper();
  }
  getById(id: string): Observable<IPayments> {
    return this.http
      .get<IPaymentsDTO>(`${API_URI}/payments/${id}`, {
        withCredentials: true,
      })
      .pipe(
        map((payments: IPaymentsDTO) =>
          this.paymentsDTOMapper.toDomain(payments)
        )
      );
  }

  getAccountById(id: string): Observable<IAccount> {
    return this.http.get<IAccount>(
      `${API_URI}/payments/accounts/single/${id}`,
      {
        withCredentials: true,
      }
    );
  }
  getAllAccounts(): Observable<IAccount[]> {
    return this.http.get<IAccount[]>(`${API_URI}/payments/accounts/all`, {
      withCredentials: true,
    });
  }

  getAllByType(type: PaymentType): Observable<IPayments[]> {
    return this.http
      .get<IPaymentsDTO[]>(`${API_URI}/payments/all/type/${type}`, {
        withCredentials: true,
      })
      .pipe(
        map((paymentsList: IPaymentsDTO[]) =>
          this.paymentsDTOMapper.toDomainList(paymentsList)
        )
      );
  }
  getAllByReference(referenceId: string): Observable<IPayments[]> {
    return this.http
      .get<IPaymentsDTO[]>(`${API_URI}/payments/all/reference/${referenceId}`, {
        withCredentials: true,
      })
      .pipe(
        map((PaymentsList: IPaymentsDTO[]) =>
          this.paymentsDTOMapper.toDomainList(PaymentsList)
        )
      );
  }
  create(payment: IPayments): Observable<IPayments> {
    const paymentDTO = this.paymentsDTOMapper.toDTO(payment);
    return this.http.post<IPaymentsDTO>(`${API_URI}/payments`, paymentDTO, {
      withCredentials: true,
    });
  }

  updateAccountBalance(
    accountId: string,
    value: number,
    operation: PaymentType
  ): Observable<void> {
    return this.http.put<void>(
      `${API_URI}/payments/accounts`,
      {
        account_id: accountId,
        value: value,
        operation: operation,
      },
      {
        withCredentials: true,
      }
    );
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${API_URI}/payments/${id}`, {
      withCredentials: true,
    });
  }
}
