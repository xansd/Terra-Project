import { IPartner } from "../../partners/domain/partner";
import { ITransactions, TransactionCategoryType } from "./transactions";

export interface ITransactionsRepository {
  getById(id: string): Promise<ITransactions | null>;
  getPartnerAccountTransactions(id: string): Promise<ITransactions[] | null>;
  getAllTransactions(): Promise<ITransactions[]>;
  getAllIncomes(): Promise<ITransactions[]>;
  getAllExpenses(): Promise<ITransactions[]>;
  getAllTransactionsByType(
    type: TransactionCategoryType
  ): Promise<ITransactions[]>;
  create(transaction: ITransactions): Promise<ITransactions>;
  delete(id: string, user: string): Promise<void>;
  deleteFeeTransaction(
    feeId: string,
    transactionid: string,
    user: string
  ): Promise<void>;
}
