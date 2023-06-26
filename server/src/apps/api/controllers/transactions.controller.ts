import { Request, Response } from "express";
import { TransactionsMapper } from "../../../modules/transactions/application/transactions-dto.mapper";
import { DomainValidationError } from "../../../modules/shared/domain/domain-validation.exception";
import { GetTransactions } from "../../../modules/transactions/application/use-cases/get-transactions.use-cases";
import { UpdateTransactions } from "../../../modules/transactions/application/use-cases/update-transactions.use-case";
import { BadRequest, NotFound, InternalServerError } from "../error/http-error";
import {
  TransactionCreationError,
  TransactionDoesNotExistError,
  TransactionNotFoundError,
} from "../../../modules/transactions/domain/transactions.exception";

export class TransactionsController {
  transactionsMapper = new TransactionsMapper();

  constructor(
    private readonly getTransactionsService: GetTransactions,
    private readonly updateTransactionsService: UpdateTransactions
  ) {}

  async getById(request: Request, response: Response): Promise<void> {
    const { id } = request.params;
    try {
      const payment = await this.getTransactionsService.getById(id);
      response.json(this.transactionsMapper.toDTO(payment));
    } catch (error) {
      if (error instanceof DomainValidationError) {
        response.send(BadRequest(error.message));
      } else if (error instanceof TransactionDoesNotExistError) {
        response.send(NotFound(error.message));
      } else {
        response.send(InternalServerError(error));
      }
    }
  }

  async getAllIncomes(request: Request, response: Response): Promise<void> {
    try {
      const transactions = await this.getTransactionsService.getAllIncomes();
      const transactionsDTOs = this.transactionsMapper.toDTOList(transactions);
      response.json(transactionsDTOs);
    } catch (error: any) {
      if (error instanceof DomainValidationError) {
        response.send(BadRequest(error.message));
      } else if (error instanceof TransactionNotFoundError) {
        response.send(NotFound(error.message));
      } else {
        response.send(InternalServerError(error));
      }
    }
  }

  async getAllExpenses(request: Request, response: Response): Promise<void> {
    try {
      const transactions = await this.getTransactionsService.getAllExpenses();
      const transactionsDTOs = this.transactionsMapper.toDTOList(transactions);
      response.json(transactionsDTOs);
    } catch (error: any) {
      if (error instanceof DomainValidationError) {
        response.send(BadRequest(error.message));
      } else if (error instanceof TransactionNotFoundError) {
        response.send(NotFound(error.message));
      } else {
        response.send(InternalServerError(error));
      }
    }
  }

  async getAllTransactionsByType(
    request: Request,
    response: Response
  ): Promise<void> {
    try {
      const transactions =
        await this.getTransactionsService.getAllTransactionsByType(
          request.body.type
        );
      const transactionsDTOs = this.transactionsMapper.toDTOList(transactions);
      response.json(transactionsDTOs);
    } catch (error: any) {
      if (error instanceof DomainValidationError) {
        response.send(BadRequest(error.message));
      } else if (error instanceof TransactionNotFoundError) {
        response.send(NotFound(error.message));
      } else {
        response.send(InternalServerError(error));
      }
    }
  }

  async create(request: Request, response: Response): Promise<void> {
    try {
      const transactions = await this.updateTransactionsService.create(
        request.body
      );
      const transactionsDTOs = this.transactionsMapper.toDTO(transactions!);
      response.json(transactionsDTOs);
    } catch (error) {
      if (error instanceof TransactionCreationError) {
        response.send(BadRequest(error.message));
      } else response.send(InternalServerError(error));
    }
  }

  async delete(request: Request, response: Response): Promise<void> {
    const { id } = request.params;

    try {
      const result = await this.updateTransactionsService.delete(id);
      response.send(result);
    } catch (error) {
      if (error instanceof DomainValidationError) {
        response.send(BadRequest(error.message));
      } else if (error instanceof TransactionDoesNotExistError) {
        response.send(NotFound(error.message));
      } else {
        response.send(InternalServerError(error));
      }
    }
  }
}
