import { IHarvests } from "./harvests";
import { IPurchase, IPurchaseDetails } from "./purchases";

export interface IPurchasesRepository {
  getPurchaseById(id: string): Promise<IPurchase>;
  getAllPurchases(): Promise<IPurchase[]>;
  createPurchase(purchase: IPurchase): Promise<IPurchase>;
  deletePurchase(id: string): Promise<void>;
  enrollPurchaseDetails(details: IPurchaseDetails[]): Promise<void>;

  getHarvestById(id: string): Promise<IHarvests>;
  getAllHarvests(): Promise<IHarvests[]>;
  createHarvest(harvest: IHarvests): Promise<IHarvests>;
  deleteHarvest(id: string): Promise<void>;
}
