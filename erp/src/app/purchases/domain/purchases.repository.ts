import { Observable } from 'rxjs';
import { IHarvests } from './harvests';
import { IPurchase } from './purchases';
import { StockOperations } from 'src/app/products/domain/products';

export interface IPurchasesRepository {
  getPurchaseById(id: string): Observable<IPurchase>;
  getAllPurchases(): Observable<IPurchase[]>;
  getAllByProvider(id: string): Observable<IPurchase[]>;
  createPurchase(purchase: IPurchase): Observable<IPurchase>;
  updatePurchase(purchase: IPurchase): Observable<void>;
  deletePurchase(id: string): Observable<void>;

  getHarvestById(id: string): Observable<IHarvests>;
  getAllHarvests(): Observable<IHarvests[]>;
  getAllByCultivator(id: string): Observable<IHarvests[]>;
  getAllByVariety(id: string): Observable<IHarvests[]>;
  createHarvest(harvest: IHarvests): Observable<IHarvests>;
  updateHarvestStock(
    harvestId: string,
    stock: number,
    operation: StockOperations
  ): Observable<void>;
  updateHarvestLoss(
    harvestId: string,
    loss: number,
    operation: StockOperations
  ): Observable<void>;
  updateHarvestManicured(
    harvestId: string,
    manicured: number
  ): Observable<void>;
  updateHarvestFee(harvestId: string, fee: number): Observable<void>;
  deleteHarvest(id: string): Observable<void>;
}
