import Logger from "../../../../apps/utils/logger";
import { IPurchase } from "../../domain/purchases";
import {
  PurchaseDoesNotExistError,
  PurchaseNotFoundError,
} from "../../domain/purchases.exception";
import { IPurchasesRepository } from "../../domain/purchases.repository";

export interface IGetPurchases {
  getPurchaseById(id: string): Promise<IPurchase>;
  getAllPurchases(): Promise<IPurchase[]>;
}

export class GetPurchases implements IGetPurchases {
  constructor(private readonly purchasesRepository: IPurchasesRepository) {}
  async getPurchaseById(id: string): Promise<IPurchase> {
    const purchases = await this.purchasesRepository.getPurchaseById(id);
    if (!purchases) {
      Logger.error(
        `purchases-repository : getPurchaseById : ${PurchaseDoesNotExistError}`
      );
      throw new PurchaseDoesNotExistError();
    }
    return purchases;
  }

  async getAllPurchases(): Promise<IPurchase[]> {
    const purchases = await this.purchasesRepository.getAllPurchases();
    if (purchases.length === 0) {
      const purchasesNotFound = new PurchaseNotFoundError();
      Logger.error(
        `purchases-repository : getAllPurchases : ${PurchaseNotFoundError}`
      );
      throw purchasesNotFound;
    }

    return purchases;
  }
}
