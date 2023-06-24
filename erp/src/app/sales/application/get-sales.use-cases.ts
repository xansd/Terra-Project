import { Observable } from 'rxjs';
import { ISales } from '../domain/sales';
import { ISalesRepository } from '../domain/sales.repository';
import { Injectable, Inject } from '@angular/core';

export interface IGetSales {
  getById(id: string): Observable<ISales>;
  getAll(): Observable<ISales[]>;
}
@Injectable({
  providedIn: 'root',
})
export class GetSales implements IGetSales {
  constructor(
    @Inject('salesAPI') private readonly salesAPI: ISalesRepository
  ) {}

  getById(id: string): Observable<ISales> {
    return this.salesAPI.getById(id);
  }
  getAll(): Observable<ISales[]> {
    return this.salesAPI.getAll();
  }
  getAllPartnerSales(id: string): Observable<ISales[]> {
    return this.salesAPI.getAllPartnerSales(id);
  }
}
