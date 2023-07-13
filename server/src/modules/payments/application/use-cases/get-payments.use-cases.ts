import Logger from "../../../../apps/utils/logger";
import {
  AccountDoesNotExistError,
  AccountNotFoundError,
} from "../../../transactions/domain/transactions.exception";
import { IAccount, IPayments, PaymentType } from "../../domain/payments";
import { PaymentDoesNotExistError } from "../../domain/payments.exception";
import { IPaymentsRepository } from "../../domain/payments.repository";
import { PaymentsService } from "./services/payments.service";

export interface IGetPayments {
  getById(id: string): Promise<IPayments>;
  getAllByType(type: PaymentType): Promise<IPayments[]>;
  getAllByReference(referenceId: string): Promise<IPayments[]>;
  getAccountById(id: string): Promise<IAccount>;
  getAllAccounts(): Promise<IAccount[]>;
}

export class GetPayments implements IGetPayments {
  private service: PaymentsService = new PaymentsService(
    this.paymentsRepository
  );
  constructor(private readonly paymentsRepository: IPaymentsRepository) {}
  async getById(id: string): Promise<IPayments> {
    const payment = await this.paymentsRepository.getById(id);
    if (!payment) {
      Logger.error(
        `payment-repository : getById : ${PaymentDoesNotExistError}`
      );
      throw new PaymentDoesNotExistError();
    }
    return payment;
  }

  async getAccountById(id: string): Promise<IAccount> {
    const account = await this.paymentsRepository.getAccountById(id);
    if (!account) {
      Logger.error(`account : getById : ${AccountDoesNotExistError}`);
      throw new AccountDoesNotExistError();
    }
    // Obtenemos el balance antes de devolver la cuenta
    const balance = await this.service.getAccountBalance(id);
    account.balance = balance;
    return account;
  }

  async getAllAccounts(): Promise<IAccount[]> {
    const accounts = await this.paymentsRepository.getAllAccounts();
    if (accounts.length === 0) {
      const accountNotFound = new AccountNotFoundError();
      Logger.error(`accounts : getAllAccounts : ${AccountNotFoundError}`);
      throw accountNotFound;
    }

    return accounts;
  }

  async getAllByType(type: PaymentType): Promise<IPayments[]> {
    const payments = await this.paymentsRepository.getAllByType(type);
    if (payments.length === 0) {
      const paymentNotFound = new PaymentDoesNotExistError();
      Logger.error(
        `payment-repository : getAllByType : ${PaymentDoesNotExistError}`
      );
      throw paymentNotFound;
    }

    return payments;
  }

  async getAllByReference(referenceId: string): Promise<IPayments[]> {
    const payments = await this.paymentsRepository.getAllByReference(
      referenceId
    );
    // if (payments.length === 0) {
    //   const paymentNotFound = new PaymentDoesNotExistError();
    //   Logger.error(
    //     `payment-repository : getAllByType : ${PaymentDoesNotExistError}`
    //   );
    //   throw paymentNotFound;
    // }

    return payments;
  }
}
