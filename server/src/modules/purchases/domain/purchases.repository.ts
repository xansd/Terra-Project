import { IHarvests } from "./harvests";
import { IPurchase, IPurchaseDetails } from "./purchases";

export interface IPurchasesRepository {
  getPurchaseById(id: string): Promise<IPurchase>;
  getAllPurchases(): Promise<IPurchase[]>;
  createPurchase(purchase: IPurchase): Promise<IPurchase>;
  updatePurchase(purchase: IPurchase): Promise<void>;
  deletePurchase(id: string): Promise<void>;

  getHarvestById(id: string): Promise<IHarvests>;
  getAllHarvests(): Promise<IHarvests[]>;
  createHarvest(harvest: IHarvests): Promise<IHarvests>;
  updateHarvest(harvest: IHarvests): Promise<void>;
  deleteHarvest(id: string): Promise<void>;
}
