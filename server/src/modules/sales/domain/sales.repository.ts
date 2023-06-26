import { ISales } from "./sales";

export interface ISalesRepository {
  getById(id: string): Promise<ISales>;
  getAll(): Promise<ISales[]>;
  getAllPartnerSales(id: string): Promise<ISales[]>;
  create(purchase: ISales): Promise<ISales>;
  delete(id: string): Promise<void>;
}
