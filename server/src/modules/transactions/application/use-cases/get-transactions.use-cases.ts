import Logger from "../../../../apps/utils/logger";
import { PaymentDoesNotExistError } from "../../../payments/domain/payments.exception";
import {
  ITransactions,
  TransactionCategoryType,
} from "../../domain/transactions";
import {
  TransactionDoesNotExistError,
  TransactionNotFoundError,
} from "../../domain/transactions.exception";
import { ITransactionsRepository } from "../../domain/transactions.repository";

export interface IGetTransactions {
  getById(id: string): Promise<ITransactions>;
  getAllIncomes(): Promise<ITransactions[]>;
  getAllExpenses(): Promise<ITransactions[]>;
  getAllTransactionsByType(
    type: TransactionCategoryType
  ): Promise<ITransactions[]>;
}

export class GetTransactions implements IGetTransactions {
  constructor(
    private readonly transactionsRepository: ITransactionsRepository
  ) {}
  async getById(id: string): Promise<ITransactions> {
    const payment = await this.transactionsRepository.getById(id);
    if (!payment) {
      Logger.error(`transaction : getById : ${PaymentDoesNotExistError}`);
      throw new PaymentDoesNotExistError();
    }
    return payment;
  }

  async getAllIncomes(): Promise<ITransactions[]> {
    const transaction = await this.transactionsRepository.getAllIncomes();
    if (transaction.length === 0) {
      const transactionNotFound = new TransactionNotFoundError();
      Logger.error(`transaction : getAllIncomes : ${TransactionNotFoundError}`);
      throw transactionNotFound;
    }

    return transaction;
  }

  async getAllExpenses(): Promise<ITransactions[]> {
    const transaction = await this.transactionsRepository.getAllExpenses();
    if (transaction.length === 0) {
      const transactionNotFound = new TransactionNotFoundError();
      Logger.error(
        `transaction : getAllExpenses : ${TransactionNotFoundError}`
      );
      throw transactionNotFound;
    }

    return transaction;
  }

  async getAllTransactionsByType(
    type: TransactionCategoryType
  ): Promise<ITransactions[]> {
    const Transactions =
      await this.transactionsRepository.getAllTransactionsByType(type);
    if (Transactions.length === 0) {
      const paymentNotFound = new TransactionDoesNotExistError();
      Logger.error(
        `transaction : getAllTransactionsByType : ${TransactionDoesNotExistError}`
      );
      throw paymentNotFound;
    }

    return Transactions;
  }
}
