import Logger from "../../../../apps/utils/logger";
import {
  ITransactions,
  TransactionCategoryType,
  TransactionsTypes,
} from "../../domain/transactions";
import {
  TransactionDoesNotExistError,
  TransactionNotFoundError,
} from "../../domain/transactions.exception";
import { ITransactionsRepository } from "../../domain/transactions.repository";

export interface IGetTransactions {
  getById(id: string): Promise<ITransactions>;
  getAllTransactions(): Promise<ITransactions[]>;
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
    const transaction = await this.transactionsRepository.getById(id);
    if (!transaction) {
      Logger.error(`transaction : getById : ${TransactionDoesNotExistError}`);
      throw new TransactionDoesNotExistError();
    }
    return transaction;
  }

  async getPartnerAccountTransactions(id: string): Promise<ITransactions[]> {
    const transaction =
      await this.transactionsRepository.getPartnerAccountTransactions(id);
    if (!transaction || transaction.length === 0) {
      const transactionNotFound = new TransactionNotFoundError();
      Logger.error(
        `transaction : getPartnerAccountTransactions : ${TransactionNotFoundError}`
      );
      throw transactionNotFound;
    }

    return transaction;
  }

  async getAllTransactions(): Promise<ITransactions[]> {
    const transaction = await this.transactionsRepository.getAllTransactions();
    if (transaction.length === 0) {
      const transactionNotFound = new TransactionNotFoundError();
      Logger.error(
        `transaction : getAllTransactions : ${TransactionNotFoundError}`
      );
      throw transactionNotFound;
    }

    return transaction;
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
    const transactions =
      await this.transactionsRepository.getAllTransactionsByType(type);
    if (transactions.length === 0) {
      const paymentNotFound = new TransactionDoesNotExistError();
      Logger.error(
        `transaction : getAllTransactionsByType : ${TransactionDoesNotExistError}`
      );
      throw paymentNotFound;
    }

    return transactions;
  }
}
