import { UpdatePayments } from "../../../payments/application/use-cases/update-payments.use-case";
import { PaymentType } from "../../../payments/domain/payments";
import { DatetimeHelperService } from "../../../shared/application/datetime.helper.service";
import { UpdateTransactions } from "../../../transactions/application/use-cases/update-transactions.use-case";
import { TransactionsTypes } from "../../../transactions/domain/transactions";
import { AccountInsufficientBalance } from "../../../transactions/domain/transactions.exception";
import { OperationPartnerCash, IPartner } from "../../domain/partner";
import {
  MinZeroError,
  InvalidAmountError,
  MaxRefundLimitError,
  MaxDebtLimitError,
  PartnerInsufficientBalance,
} from "../../domain/partner.exceptions";

export class PartnerCashService {
  constructor() {}
  async updatePartnerCash(
    amount: string,
    actualCash: number,
    operation: OperationPartnerCash,
    partner: IPartner,
    updateTransactions: UpdateTransactions,
    updatePayments: UpdatePayments,
    account: string,
    user: string
  ): Promise<number> {
    let final = 0;
    const actual = Number(actualCash) * 100;
    const income = Number(amount) * 100;

    if (income <= 0) {
      throw new MinZeroError();
    }

    if (isNaN(income) || isNaN(actual)) {
      throw new InvalidAmountError();
    }

    if (operation === OperationPartnerCash.REFUND) {
      final = actual - income;
      if (final < 0) {
        throw new MaxRefundLimitError();
      }
      final /= 100;
      await this.createRefundTransaction(
        income / 100,
        operation,
        partner,
        user,
        updateTransactions,
        updatePayments,
        account,
        TransactionsTypes.REINTEGRO_CUENTA_SOCIO
      );
    } else if (operation === OperationPartnerCash.WITHDRAWAL) {
      final = actual - income;
      final /= 100;
      if (final < partner.debt_limit!) {
        throw new MaxDebtLimitError();
      }
    } else if (operation === OperationPartnerCash.INCOME) {
      final = actual + income;
      final /= 100;
      await this.createIncomeTransaction(
        income / 100,
        operation,
        partner,
        user,
        updateTransactions,
        updatePayments,
        account,
        TransactionsTypes.INGRESO_CUENTA_SOCIO
      );
    } else if (operation === OperationPartnerCash.FEE_PAYMENT) {
      final = actual - income;
      if (final < 0) {
        throw new PartnerInsufficientBalance();
      }
      final /= 100;
      // La creación de transacciónes se realiza en FeesUseCase
    } else if (operation === OperationPartnerCash.FEE_REFUND) {
      final = actual + income;
      final /= 100;
      // La creación de transacciónes se realiza en FeesUseCase
    }
    return final;
  }

  private async createIncomeTransaction(
    amount: number,
    operation: OperationPartnerCash,
    partner: IPartner,
    user: string,
    updateTransactions: UpdateTransactions,
    updatePayments: UpdatePayments,
    account: string,
    transactionType: TransactionsTypes
  ): Promise<void> {
    const transaction = await updateTransactions.create({
      transaction_id: undefined,
      code: undefined,
      amount: amount,
      notes: operation,
      transaction_type_id: transactionType.toString(),
      recurrence_days: 0,
      recurrence_times: 0,
      date_start: DatetimeHelperService.dateToString(new Date()),
      interest: 0,
      partner_id: partner.partner_id.value,
      user_created: user,
    });

    await updatePayments.create(
      {
        type: PaymentType.COBRO,
        reference_id: transaction.transaction_id?.value!,
        amount: amount,
        notes: operation,
        account_id: account,
      },
      user
    );
  }

  private async createRefundTransaction(
    amount: number,
    operation: OperationPartnerCash,
    partner: IPartner,
    user: string,
    updateTransactions: UpdateTransactions,
    updatePayments: UpdatePayments,
    account: string,
    transactionType: TransactionsTypes
  ): Promise<void> {
    const transaction = await updateTransactions.create({
      transaction_id: undefined,
      code: undefined,
      amount: amount,
      notes: operation,
      transaction_type_id: transactionType.toString(),
      recurrence_days: 0,
      recurrence_times: 0,
      date_start: DatetimeHelperService.dateToString(new Date()),
      interest: 0,
      partner_id: partner.partner_id.value,
      user_created: user,
    });
    const transactionId = transaction.transaction_id?.value!;
    try {
      await updatePayments.create(
        {
          type: PaymentType.PAGO,
          reference_id: transactionId,
          amount: amount,
          notes: operation,
          account_id: account,
        },
        user
      );
    } catch (error) {
      if (error instanceof AccountInsufficientBalance) {
        // Si no hay saldo suficiente en la cuenta el pago no es creado y la transacción eliminada
        await updateTransactions.delete(transactionId, user);
        throw error;
      }
    }
  }
}
