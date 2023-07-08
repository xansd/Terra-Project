import { Observable } from 'rxjs';
import { IHarvests } from '../domain/harvests';
import { IPurchasesRepository } from '../domain/purchases.repository';
import { Injectable, Inject } from '@angular/core';
import { StockOperations } from 'src/app/products/domain/products';
import { InvalidAmountError } from 'src/app/payments/domain/payments.exception';

export interface IUpdateHarvests {
  createHarvest(harvests: IHarvests): Observable<IHarvests>;
  updateHarvestStock(
    harvestId: string,
    stock: number,
    operation: StockOperations
  ): Observable<void>;
  updateHarvestManicured(
    harvestId: string,
    manicured: number
  ): Observable<void>;
  updateHarvestFee(harvestId: string, fee: number): Observable<void>;
  deleteHarvest(id: string): Observable<void>;
}
@Injectable({
  providedIn: 'root',
})
export class UpdateHarvests implements IUpdateHarvests {
  constructor(
    @Inject('purchasesAPI') private readonly purchasesAPI: IPurchasesRepository
  ) {}
  createHarvest(harvests: IHarvests): Observable<IHarvests> {
    return this.purchasesAPI.createHarvest(harvests);
  }
  updateHarvestStock(
    harvestId: string,
    stock: number,
    operation: StockOperations
  ): Observable<void> {
    return this.purchasesAPI.updateHarvestStock(harvestId, stock, operation);
  }
  updateHarvestLoss(
    harvestId: string,
    loss: number,
    operation: StockOperations
  ): Observable<void> {
    return this.purchasesAPI.updateHarvestLoss(harvestId, loss, operation);
  }
  updateHarvestManicured(
    harvestId: string,
    manicured: number
  ): Observable<void> {
    return this.purchasesAPI.updateHarvestManicured(harvestId, manicured);
  }

  updateHarvestFee(harvestId: string, fee: number): Observable<void> {
    return this.purchasesAPI.updateHarvestFee(harvestId, fee);
  }
  deleteHarvest(id: string): Observable<void> {
    return this.purchasesAPI.deleteHarvest(id);
  }

  // Si type es true estamos ante una perdida. En caso contrario es excedente.
  getLossValue(value: string, type: boolean): number {
    let result = 0;
    if (type) {
      result = Number(value) * -1;
    } else result = Number(value);
    if (isNaN(result)) {
      throw new InvalidAmountError();
    }
    return result;
  }
}
