import { PaymentType } from "../../../payments/domain/payments";
import { DatetimeHelperService } from "../../../shared/application/datetime.helper.service";
import { TransactionsTypes } from "../../../transactions/domain/transactions";
import { OperationPartnerCash, IPartner } from "../../domain/partner";
import {
  MinZeroError,
  InvalidAmountError,
  MaxRefundLimitError,
  MaxDebtLimitError,
} from "../../domain/partner.exceptions";

export class PartnerCashService {
  async updatePartnerCash(
    amount: string,
    actualCash: number,
    operation: OperationPartnerCash,
    partner: IPartner,
    incomeObject: any,
    paymentObject: any,
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
        final,
        operation,
        partner,
        user,
        incomeObject,
        paymentObject
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
        final,
        operation,
        partner,
        user,
        incomeObject,
        paymentObject
      );
    }
    return final;
  }

  private async createIncomeTransaction(
    amount: number,
    operation: OperationPartnerCash,
    partner: IPartner,
    user: string,
    incomeObject: any,
    paymentObject: any
  ): Promise<void> {
    const incomePromise = incomeObject.create({
      transaction_id: undefined,
      code: undefined,
      amount: amount,
      notes: operation,
      transaction_type_id: TransactionsTypes.INGRESO_CUENTA_SOCIO.toString(),
      recurrence_days: 0,
      recurrence_times: 0,
      date_start: DatetimeHelperService.dateToString(new Date()),
      interest: 0,
      user_created: user,
    });

    const paymentPromise = paymentObject.create({
      type: PaymentType.COBRO,
      reference_id: partner.partner_id.value,
      amount: amount,
      notes: operation,
      user_created: user,
    });

    await Promise.all([incomePromise, paymentPromise]);
  }

  private async createRefundTransaction(
    amount: number,
    operation: OperationPartnerCash,
    partner: IPartner,
    user: string,
    incomeObject: any,
    paymentObject: any
  ): Promise<void> {
    const incomePromise = incomeObject.create({
      transaction_id: undefined,
      code: undefined,
      amount: amount,
      notes: operation,
      transaction_type_id: TransactionsTypes.REINTEGRO_CUENTA_SOCIO.toString(),
      recurrence_days: 0,
      recurrence_times: 0,
      date_start: DatetimeHelperService.dateToString(new Date()),
      interest: 0,
      user_created: user,
    });

    const paymentPromise = paymentObject.create({
      type: PaymentType.PAGO,
      reference_id: partner.partner_id.value,
      amount: amount,
      notes: operation,
      user_created: user,
    });

    await Promise.all([incomePromise, paymentPromise]);
  }
}
