import { Observable } from 'rxjs';
import { IHarvests } from '../domain/harvests';
import { IPurchasesRepository } from '../domain/purchases.repository';
import { Injectable, Inject } from '@angular/core';

export interface IUpdateHarvests {
  createHarvest(harvests: IHarvests): Observable<IHarvests>;
  updateHarvests(harvests: IHarvests): Observable<void>;
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
  updateHarvests(harvests: IHarvests): Observable<void> {
    return this.purchasesAPI.updateHarvest(harvests);
  }
  deleteHarvest(id: string): Observable<void> {
    return this.purchasesAPI.deleteHarvest(id);
  }
}
