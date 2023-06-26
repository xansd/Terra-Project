import Logger from "../../../../apps/utils/logger";
import { IPurchase } from "../../../purchases/domain/purchases";
import {
  PurchaseDoesNotExistError,
  PurchaseNotFoundError,
} from "../../../purchases/domain/purchases.exception";
import { ISales } from "../../domain/sales";
import {
  SaleDoesNotExistError,
  SaleNotFoundError,
} from "../../domain/sales.exception";
import { ISalesRepository } from "../../domain/sales.repository";

export interface IGetSales {
  getById(id: string): Promise<ISales>;
  getAll(): Promise<ISales[]>;
}

export class GetSales implements IGetSales {
  constructor(private readonly SalesRepository: ISalesRepository) {}
  async getById(id: string): Promise<ISales> {
    const sales = await this.SalesRepository.getById(id);
    if (!sales) {
      Logger.error(`sales-repository : getById : ${SaleDoesNotExistError}`);
      throw new PurchaseDoesNotExistError();
    }
    return sales;
  }

  async getAll(): Promise<ISales[]> {
    const sales = await this.SalesRepository.getAll();
    if (sales.length === 0) {
      const salesNotFound = new SaleNotFoundError();
      Logger.error(`sales-repository : getAll : ${SaleNotFoundError}`);
      throw salesNotFound;
    }

    return sales;
  }

  async getAllPartnerSales(id: string): Promise<ISales[]> {
    const sales = await this.SalesRepository.getAllPartnerSales(id);
    if (sales.length === 0) {
      const salesNotFound = new SaleNotFoundError();
      Logger.error(
        `sales-repository : getAllPartnerSales : ${SaleNotFoundError}`
      );
      throw salesNotFound;
    }

    return sales;
  }
}
