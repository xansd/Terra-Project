import { Observable } from 'rxjs';
import { ISales } from '../domain/sales';
import { ISalesRepository } from '../domain/sales.repository';
import { ISalesDTO } from '../infrastructure/sales-dto.mapper';
import { Injectable, Inject } from '@angular/core';

export interface IUpdateSales {
  create(sale: ISalesDTO): Observable<ISales>;
  delete(id: string): Observable<void>;
}
Injectable({
  providedIn: 'root',
});
export class UpdateSales implements IUpdateSales {
  constructor(
    @Inject('salesAPI') private readonly salesAPI: ISalesRepository
  ) {}
  create(sale: ISalesDTO): Observable<ISales> {
    return this.salesAPI.create(sale);
  }
  delete(id: string): Observable<void> {
    return this.salesAPI.delete(id);
  }
}
