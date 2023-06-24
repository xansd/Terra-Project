import { Observable } from 'rxjs';
import { IPurchase } from '../domain/purchases';
import { IPurchasesRepository } from '../domain/purchases.repository';
import { Injectable, Inject } from '@angular/core';

export interface IUpdatePurchases {
  createPurchase(Purchases: IPurchase): Observable<IPurchase>;
  updatePurchase(Purchases: IPurchase): Observable<void>;
  deletePurchase(id: string): Observable<void>;
}
@Injectable({
  providedIn: 'root',
})
export class UpdatePurchases implements IUpdatePurchases {
  constructor(
    @Inject('purchasesAPI') private readonly purchasesAPI: IPurchasesRepository
  ) {}
  createPurchase(purchase: IPurchase): Observable<IPurchase> {
    return this.purchasesAPI.createPurchase(purchase);
  }
  updatePurchase(purchase: IPurchase): Observable<void> {
    return this.purchasesAPI.updatePurchase(purchase);
  }
  deletePurchase(id: string): Observable<void> {
    return this.purchasesAPI.deletePurchase(id);
  }
}
