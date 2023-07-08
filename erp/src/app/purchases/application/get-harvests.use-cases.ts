import { Observable } from 'rxjs';
import { IHarvests } from '../domain/harvests';
import { IPurchasesRepository } from '../domain/purchases.repository';
import { Injectable, Inject } from '@angular/core';
import { InvalidAmountError } from 'src/app/payments/domain/payments.exception';

export interface IGetHarvests {
  getHarvestById(id: string): Observable<IHarvests>;
  getAllHarvests(): Observable<IHarvests[]>;
}
@Injectable({
  providedIn: 'root',
})
export class GetHarvests implements IGetHarvests {
  constructor(
    @Inject('purchasesAPI') private readonly purchasesAPI: IPurchasesRepository
  ) {}
  getHarvestById(id: string): Observable<IHarvests> {
    return this.purchasesAPI.getHarvestById(id);
  }
  getAllHarvests(): Observable<IHarvests[]> {
    return this.purchasesAPI.getAllHarvests();
  }
  getAllHarvestsByCultivator(id: string): Observable<IHarvests[]> {
    return this.purchasesAPI.getAllByCultivator(id);
  }

  getAllHarvestsByVariety(id: string): Observable<IHarvests[]> {
    return this.purchasesAPI.getAllByVariety(id);
  }

  // Calcula el stock actual menso las perdidas
  getHarvestFinalStock(harvest: IHarvests): number {
    let result = 0;
    const stock = Number(harvest.stock);
    const manicured = Number(harvest.manicured);
    const loss = Number(harvest.loss);
    result = stock + (manicured + loss);
    if (isNaN(result)) {
      throw new InvalidAmountError();
    }
    if (result < 0) result = 0;
    return result;
  }

  getHarvestFinalCost(harvest: IHarvests): number {
    let result = 0;
    const cost = Number(harvest.cost_price);
    const quantity = Number(harvest.quantity);
    result = cost * quantity;
    if (isNaN(result)) {
      throw new InvalidAmountError();
    }
    return result;
  }

  getHarvestSalePrice(harvest: IHarvests): number {
    let result = 0;
    const costPrice = Number(harvest.cost_price);
    const feeAmount = Number(harvest.fee_amount);
    result = costPrice + feeAmount;
    if (isNaN(result)) {
      throw new InvalidAmountError();
    }
    if (result < 0 || result === 0) result = 0.01;
    return result;
  }
}
