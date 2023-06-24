import SERVER from '../../config/server.config';
import { Injectable } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ISales } from '../domain/sales';
import { ISalesRepository } from '../domain/sales.repository';
import { SalesMapper, ISalesDTO } from './sales-dto.mapper';

const API_URI = SERVER.API_URI;

@Injectable({ providedIn: 'root' })
export class SalesAPIRepository implements ISalesRepository {
  private readonly salesMapper: SalesMapper;
  constructor(private http: HttpClient) {
    this.salesMapper = new SalesMapper();
  }
  getById(id: string): Observable<ISales> {
    return this.http
      .get<ISalesDTO>(`${API_URI}/sales/${id}`, {
        withCredentials: true,
      })
      .pipe(map((purchase: ISalesDTO) => this.salesMapper.toDomain(purchase)));
  }

  getAll(): Observable<ISales[]> {
    return this.http
      .get<ISalesDTO[]>(`${API_URI}/sales`, {
        withCredentials: true,
      })
      .pipe(
        map((salesList: ISalesDTO[]) =>
          this.salesMapper.toDomainList(salesList)
        )
      );
  }

  getAllPartnerSales(id: string): Observable<ISales[]> {
    return this.http
      .get<ISalesDTO[]>(`${API_URI}/sales/partner/${id}`, {
        withCredentials: true,
      })
      .pipe(
        map((salesList: ISalesDTO[]) =>
          this.salesMapper.toDomainList(salesList)
        )
      );
  }

  create(purchase: ISales): Observable<ISales> {
    const salesDTO = this.salesMapper.toDTO(purchase);
    return this.http.post<ISales>(`${API_URI}/sales`, salesDTO, {
      withCredentials: true,
    });
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${API_URI}/sales/${id}`, {
      withCredentials: true,
    });
  }
}
