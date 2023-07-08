import { IHarvests } from "./harvests";
import { IPurchase, IPurchaseDetails } from "./purchases";

export interface IPurchasesRepository {
  getPurchaseById(id: string): Promise<IPurchase | null>;
  getAllPurchases(): Promise<IPurchase[]>;
  getAllPurchasesById(id: string, type: string): Promise<IPurchase[]>;
  createPurchase(purchase: IPurchase, user: string): Promise<IPurchase>;
  updatePurchase(purchase: IPurchase, user: string): Promise<void>;
  deletePurchase(id: string, user: string): Promise<void>;

  getHarvestById(id: string): Promise<IHarvests | null>;
  getAllHarvests(): Promise<IHarvests[]>;
  getAllHarvestsById(id: string, type: string): Promise<IHarvests[]>;
  createHarvest(harvest: IHarvests, user: string): Promise<IHarvests>;
  updateHarvestStock(
    harvestId: string,
    stock: number,
    user: string
  ): Promise<void>;
  updateHarvestManicured(
    harvestId: string,
    manicured: number,
    user: string
  ): Promise<void>;
  updateHarvestLoss(
    harvestId: string,
    loss: number,
    user: string
  ): Promise<void>;
  updateHarvestFee(harvestId: string, fee: number, user: string): Promise<void>;
  deleteHarvest(id: string, user: string): Promise<void>;
}
