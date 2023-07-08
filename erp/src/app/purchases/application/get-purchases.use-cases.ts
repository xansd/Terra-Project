import { Observable } from 'rxjs';
import { IPurchase, IPurchaseDetails } from '../domain/purchases';
import { IPurchasesRepository } from '../domain/purchases.repository';
import { Injectable, Inject } from '@angular/core';
import { InvalidAmountError } from 'src/app/payments/domain/payments.exception';

export interface IGetPurchases {
  getPurchaseById(id: string): Observable<IPurchase>;
  getAllPurchases(): Observable<IPurchase[]>;
}
@Injectable({
  providedIn: 'root',
})
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
  getAllPurchasesByProvider(id: string): Observable<IPurchase[]> {
    return this.purchasesAPI.getAllByProvider(id);
  }

  getTotalAmountOfProductLine(detail: IPurchaseDetails) {
    let result = 0;
    if (detail.lot! > 0) {
      result = Number(detail.lot) * Number(detail.amount);
    } else {
      result = Number(detail.amount) * Number(detail.quantity);
    }
    if (isNaN(result)) {
      throw new InvalidAmountError();
    }
    return result;
  }

  getTotalQuantityProductLine(detail: IPurchaseDetails) {
    let result = 0;
    if (detail.lot! > 0) {
      result = Number(detail.lot) * Number(detail.quantity);
    } else {
      result = Number(detail.quantity);
    }
    if (isNaN(result)) {
      throw new InvalidAmountError();
    }
    return result;
  }
}
