import { ITransactions, TransactionCategoryType } from "./transactions";

export interface ITransactionsRepository {
  getById(id: string): Promise<ITransactions>;
  getAllIncomes(): Promise<ITransactions[]>;
  getAllExpenses(): Promise<ITransactions[]>;
  getAllTransactionsByType(
    type: TransactionCategoryType
  ): Promise<ITransactions[]>;
  create(transaction: ITransactions): Promise<ITransactions>;
  delete(id: string): Promise<void>;
}
