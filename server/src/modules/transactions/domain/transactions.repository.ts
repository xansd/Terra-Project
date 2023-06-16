import { ITransactions } from "./transactions";

export interface ITransactionsRepository {
  getById(id: string): Promise<ITransactions>;
  getAll(): Promise<ITransactions[]>;
  create(purchase: ITransactions): Promise<ITransactions>;
  delete(id: string): Promise<void>;
}
