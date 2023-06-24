import { Observable } from 'rxjs';
import { IHarvests } from '../domain/harvests';
import { IPurchasesRepository } from '../domain/purchases.repository';
import { Injectable, Inject } from '@angular/core';

export interface IGetHarvests {
  getHarvestById(id: string): Observable<IHarvests>;
  getAllHarvests(): Observable<IHarvests[]>;
}
Injectable({
  providedIn: 'root',
});
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
}
