import { IFeesRepository } from "../../../fees/domain/fees.repository";
import { InvalidAmountError } from "../../../partners/domain/partner.exceptions";
import { IPurchasesRepository } from "../../../purchases/domain/purchases.repository";
import { ITransactionsRepository } from "../../../transactions/domain/transactions.repository";
import { IPayments } from "../../domain/payments";
import {
  PaymentLimitExceededError,
  PaymentReferenceNotFoundError,
} from "../../domain/payments.exception";
import { IPaymentsRepository } from "../../domain/payments.repository";
import { IPaymentsDTO, PaymentMapper } from "../payments-dto.mapper";

export interface IUpdatePayments {
  create(payment: IPaymentsDTO, user: string): Promise<IPayments>;
  delete(id: string, user: string): Promise<void>;
}

export class UpdatePayments implements IUpdatePayments {
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
    await this.checkPaymentLimitExceeded(this.paymentDomain);
    const paymentRepository = await this.paymentsRepository.create(
      this.paymentDomain,
      user
    );
    return paymentRepository;
  }

  async delete(id: string, user: string): Promise<void> {
    const result = await this.paymentsRepository.delete(id, user);
    return result;
  }

  // Si el pago supera la cantidad pendiente a abonar lanza una excepción
  async checkPaymentLimitExceeded(payment: IPayments): Promise<void> {
    const totalAmount = await this.getTotalAmountForReference(
      payment.reference_id
    );
    if (totalAmount !== -1) {
      const payments: IPayments[] =
        await this.paymentsRepository.getAllByReference(payment.reference_id);
      let totalPayments = 0;
      for (const i of payments) {
        totalPayments += Number(i.amount);
      }
      const actualPayment = Number(payment.amount);
      if (isNaN(actualPayment) || isNaN(totalPayments)) {
        throw new InvalidAmountError();
      }

      // Convertir a centimos
      const totalAmountCents = totalAmount * 100;
      const totalPaymentsCents = totalPayments * 100;
      const actualPaymentCents = actualPayment * 100;

      if (totalAmountCents - (totalPaymentsCents + actualPaymentCents) < 0) {
        throw new PaymentLimitExceededError();
      }
    }
  }

  // Obtiene el total de la compra, gasto o cultivo
  async getTotalAmountForReference(referenceId: string): Promise<number> {
    const purchaseRows = await this.purchasesRepository.getPurchaseById(
      referenceId
    );
    const harvestRows = await this.purchasesRepository.getHarvestById(
      referenceId
    );
    const transactionRows = await this.transactionsRepository.getById(
      referenceId
    );
    const feesRows = await this.feesRepository.getById(referenceId);

    if (purchaseRows) {
      const result = Number(purchaseRows.total_amount!);
      if (isNaN(result)) throw new InvalidAmountError();
      return result;
    } else if (harvestRows) {
      const result =
        Number(harvestRows.cost_price) * Number(harvestRows.quantity);
      if (isNaN(result)) throw new InvalidAmountError();
      return result;
    } else if (transactionRows) {
      const result = Number(transactionRows.amount);
      if (isNaN(result)) throw new InvalidAmountError();
      return result;
    } else if (feesRows) {
      return -1;
    } else {
      throw new PaymentReferenceNotFoundError();
    }
  }
}
