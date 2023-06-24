import { Observable } from 'rxjs';
import { IHarvests } from './harvests';
import { IPurchase } from './purchases';

export interface IPurchasesRepository {
  getPurchaseById(id: string): Observable<IPurchase>;
  getAllPurchases(): Observable<IPurchase[]>;
  createPurchase(purchase: IPurchase): Observable<IPurchase>;
  updatePurchase(purchase: IPurchase): Observable<void>;
  deletePurchase(id: string): Observable<void>;

  getHarvestById(id: string): Observable<IHarvests>;
  getAllHarvests(): Observable<IHarvests[]>;
  createHarvest(harvest: IHarvests): Observable<IHarvests>;
  updateHarvest(harvest: IHarvests): Observable<void>;
  deleteHarvest(id: string): Observable<void>;
}
