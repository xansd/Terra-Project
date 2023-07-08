import { ITransactions } from "../../domain/transactions";
import { ITransactionsRepository } from "../../domain/transactions.repository";
import {
  ITransactionsDTO,
  TransactionsMapper,
} from "../transactions-dto.mapper";

export interface IUpdateTransactions {
  create(transaction: ITransactionsDTO): Promise<ITransactions>;
  delete(id: string, user: string): Promise<void>;
}

export class UpdateTransactions implements IUpdateTransactions {
  private transactionMapper: TransactionsMapper = new TransactionsMapper();
  transactionDomain!: ITransactions;

  constructor(
    private readonly transactionsRepository: ITransactionsRepository
  ) {}

  async create(transaction: ITransactionsDTO): Promise<ITransactions> {
    this.transactionDomain = this.transactionMapper.toDomain(transaction);
    const transactionRepository = await this.transactionsRepository.create(
      this.transactionDomain
    );
    return transactionRepository;
  }
  async delete(id: string, user: string): Promise<void> {
    const result = await this.transactionsRepository.delete(id, user);
    return result;
  }
}
