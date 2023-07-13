import Logger from "../../../../apps/utils/logger";
import { IFeesRepository } from "../../../fees/domain/fees.repository";
import {
  InvalidAmountError,
  MinZeroError,
} from "../../../partners/domain/partner.exceptions";
import { IPurchasesRepository } from "../../../purchases/domain/purchases.repository";
import { ITransactionsRepository } from "../../../transactions/domain/transactions.repository";
import { IPayments, PaymentType } from "../../domain/payments";
import { IPaymentsRepository } from "../../domain/payments.repository";
import { IPaymentsDTO, PaymentMapper } from "../payments-dto.mapper";
import { PaymentsService } from "./services/payments.service";

export interface IUpdatePayments {
  create(payment: IPaymentsDTO, user: string): Promise<IPayments>;
  delete(id: string, user: string): Promise<void>;
  updateAccountBalance(
    accountId: string,
    value: number,
    operation: PaymentType,
    user: string
  ): Promise<void>;
}

export class UpdatePayments implements IUpdatePayments {
  private service: PaymentsService = new PaymentsService(
    this.paymentsRepository,
    this.purchasesRepository,
    this.transactionsRepository,
    this.feesRepository
  );
  private paymentMapper: PaymentMapper = new PaymentMapper();
  paymentDomain!: IPayments;

  constructor(
    private readonly paymentsRepository: IPaymentsRepository,
    private readonly transactionsRepository: ITransactionsRepository,
    private readonly purchasesRepository: IPurchasesRepository,
    private readonly feesRepository: IFeesRepository
  ) {}

  async create(payment: IPaymentsDTO, user: string): Promise<IPayments> {
    this.paymentDomain = this.paymentMapper.toDomain(payment);
    // Si se trata de PAGOS comprobamos si no excede el montante de la operacion original
    // y también si hay suficiente dinero en la cuenta para afrontarlo
    if (this.paymentDomain.type === PaymentType.PAGO) {
      await this.service.checkPaymentLimitExceeded(this.paymentDomain);
      await this.service.checkAccountBalance(this.paymentDomain);
    }
    const paymentRepository = await this.paymentsRepository.create(
      this.paymentDomain,
      user
    );
    return paymentRepository;
  }

  async delete(id: string, user: string): Promise<void> {
    const payment = await this.paymentsRepository.getById(id);
    // Si se trata de PAGOS comprobamos si hay suficiente dinero en la cuenta para afrontarlo
    if (payment.type === PaymentType.PAGO) {
      await this.service.checkAccountBalance(this.paymentDomain);
    }
    const result = await this.paymentsRepository.delete(id, user);
    return result;
  }

  // Si el pago supera la cantidad pendiente a abonar lanza una excepción

  async updateAccountBalance(
    accountId: string,
    value: number,
    operation: PaymentType,
    user: string
  ): Promise<void> {
    const account = await this.paymentsRepository.getAccountById(accountId);
    const oldBalance = Number(account?.balance) || 0;
    const _value = Number(value);
    let newBalance = 0;
    if (isNaN(_value) || isNaN(oldBalance)) {
      Logger.error(
        `updateAccountBalance : InvalidAmountError : valor incorrecto`
      );
      throw new InvalidAmountError();
    }
    if (_value < 0) {
      Logger.error(
        `updateAccountBalance :  MinZeroError : valor inferior a cero`
      );
      throw new MinZeroError();
    }
    if (operation === PaymentType.COBRO) {
      newBalance = oldBalance + _value;
    } else if (operation === PaymentType.PAGO) {
      newBalance = oldBalance - _value;
      if (newBalance < 0) {
        Logger.error(
          `updateAccountBalance :  MinZeroError : valor inferior a cero`
        );
        throw new MinZeroError();
      }
    }
    return this.paymentsRepository.updateAccountBalance(
      accountId,
      newBalance,
      user
    );
  }
}
