import { Observable } from 'rxjs';
import { IPurchase } from '../domain/purchases';
import { IPurchasesRepository } from '../domain/purchases.repository';
import { Injectable, Inject } from '@angular/core';

export interface IGetPurchases {
  getPurchaseById(id: string): Observable<IPurchase>;
  getAllPurchases(): Observable<IPurchase[]>;
}
Injectable({
  providedIn: 'root',
});
export class GetPurchases implements IGetPurchases {
  constructor(
    @Inject('purchasesAPI') private readonly purchasesAPI: IPurchasesRepository
  ) {}
  getPurchaseById(id: string): Observable<IPurchase> {
    return this.purchasesAPI.getPurchaseById(id);
  }
  getAllPurchases(): Observable<IPurchase[]> {
    return this.purchasesAPI.getAllPurchases();
  }
}
