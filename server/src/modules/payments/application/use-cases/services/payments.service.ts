import { TransactionType } from "aws-sdk/clients/lakeformation";
import { IFeesRepository } from "../../../../fees/domain/fees.repository";
import {
  InvalidAmountError,
  MinZeroError,
} from "../../../../partners/domain/partner.exceptions";
import { IPurchasesRepository } from "../../../../purchases/domain/purchases.repository";
import { TransactionsTypes } from "../../../../transactions/domain/transactions";
import { ITransactionsRepository } from "../../../../transactions/domain/transactions.repository";
import { IPayments } from "../../../domain/payments";
import {
  PaymentLimitExceededError,
  PaymentReferenceNotFoundError,
} from "../../../domain/payments.exception";
import { IPaymentsRepository } from "../../../domain/payments.repository";
import {
  AccountDoesNotExistError,
  AccountInsufficientBalance,
} from "../../../../transactions/domain/transactions.exception";
import Logger from "../../../../../apps/utils/logger";

export class PaymentsService {
  constructor(
    private paymentsRepository: IPaymentsRepository,
    private purchasesRepository?: IPurchasesRepository,
    private transactionsRepository?: ITransactionsRepository,
    private feesRepository?: IFeesRepository
  ) {}

  // Comprueba que los pagos realizados no excedan el montante original de la operación
  async checkPaymentLimitExceeded(payment: IPayments): Promise<void> {
    // TRANSACCIONES: Solo se comprueban los tipos de la lista
    const transactionsTypesBlackList = [
      TransactionsTypes.REINTEGRO_CUOTA,
      TransactionsTypes.REINTEGRO_INSCRIPCION,
      TransactionsTypes.GASTOS_ACTIVIDADES_ASOCIACION,
      TransactionsTypes.GASTOS_ALQUILER,
      TransactionsTypes.GASTOS_PRESTAMOS,
      TransactionsTypes.GASTOS_SERVICIOS,
    ];
    const totalAmount = await this.getTotalAmountForReference(
      payment.reference_id,
      transactionsTypesBlackList
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
  async getTotalAmountForReference(
    referenceId: string,
    transactionsTypesBlackList: TransactionsTypes[]
  ): Promise<number> {
    // Total compra
    const purchaseRows = await this.purchasesRepository!.getPurchaseById(
      referenceId
    );
    // Total cultivo
    const harvestRows = await this.purchasesRepository!.getHarvestById(
      referenceId
    );
    // Total transacción (existen exclusiones)
    const transactionRows = await this.transactionsRepository!.getById(
      referenceId
    );
    // Cuotas
    const feesRows = await this.feesRepository!.getById(referenceId);

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
      if (
        !transactionsTypesBlackList.includes(
          Number(transactionRows.transaction_type_id)
        )
      ) {
        return -1;
      }
      const result = Number(transactionRows.amount);
      if (isNaN(result)) throw new InvalidAmountError();
      return result;
    } else if (feesRows) {
      return -1;
    } else {
      throw new PaymentReferenceNotFoundError();
    }
  }

  async getAccountBalance(accountId: string): Promise<number> {
    let accountBalance = 0;

    // Obtener todos los pagos y cobros asociados a la cuenta
    const accountPayments = await this.paymentsRepository.getAllByAccount(
      accountId
    );

    // Calcular el saldo de la cuenta a partir de los pagos y cobros
    accountPayments.forEach((payment) => {
      if (payment.type === "PAGO") {
        accountBalance -= Number(payment.amount);
      } else if (payment.type === "COBRO") {
        accountBalance += Number(payment.amount);
      }
    });

    return accountBalance;
  }

  async checkAccountBalance(payment: IPayments) {
    const account_id = payment.account_id;

    // Verificar si la cuenta existe
    if (!account_id) {
      Logger.error(
        `checkAccountBalance : AccountDoesNotExistError : No existe la cuenta`
      );
      throw new AccountDoesNotExistError();
    }

    const accountBalance = await this.getAccountBalance(account_id.toString());
    const paymentAmount = Number(payment.amount);

    if (isNaN(accountBalance) || isNaN(paymentAmount)) {
      Logger.error(
        `checkAccountBalance : InvalidAmountError : valor incorrecto`
      );
      throw new InvalidAmountError();
    }

    if (paymentAmount < 0) {
      Logger.error(
        `checkAccountBalance : MinZeroError : El valor no puede ser negativo (paymentAmount)`
      );
      throw new MinZeroError();
    }

    const finalBalance = accountBalance - paymentAmount;
    if (finalBalance < 0) {
      Logger.error(
        `checkAccountBalance : AccountInsufficientBalance : saldo insuficiente`
      );
      throw new AccountInsufficientBalance();
    }
  }
}
