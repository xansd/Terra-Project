import Logger from "../../../../apps/utils/logger";
import { UpdatePayments } from "../../../payments/application/use-cases/update-payments.use-case";
import { PaymentType } from "../../../payments/domain/payments";
import { IPaymentsRepository } from "../../../payments/domain/payments.repository";
import { DatetimeHelperService } from "../../../shared/application/datetime.helper.service";
import { DomainValidationError } from "../../../shared/domain/domain-validation.exception";
import { UpdateTransactions } from "../../../transactions/application/use-cases/update-transactions.use-case";
import { TransactionsTypes } from "../../../transactions/domain/transactions";
import { ITransactionsRepository } from "../../../transactions/domain/transactions.repository";
import { IPartner, OperationPartnerCash } from "../../domain/partner";
import {
  InvalidAmountError,
  MaxDebtLimitError,
  MaxRefundLimitError,
  MinZeroError,
  PartnerAlreadyExistsError,
} from "../../domain/partner.exceptions";
import { IPartnerRepository } from "../../domain/partner.repository";
import { PartnerMapper } from "../partner-dto.mapper";
import { IPartnerDTO } from "../partner.dto";
import { PartnerCashService } from "../services/partner-cash.service";

export interface IUpdatePartner {
  updatePartner(partner: IPartnerDTO): Promise<void>;
}

export class UpdatePartnerUseCase implements IUpdatePartner {
  incomeObject = new UpdateTransactions(this.transactionsRepository);
  paymentObject = new UpdatePayments(this.paymentsRepository);

  private partnerMapper: PartnerMapper = new PartnerMapper();
  partnerDomain!: IPartner;

  constructor(
    private readonly partnerRepository: IPartnerRepository,
    private readonly transactionsRepository: ITransactionsRepository,
    private readonly paymentsRepository: IPaymentsRepository,
    private readonly cashService: PartnerCashService
  ) {}

  async updatePartner(partner: IPartnerDTO): Promise<void> {
    try {
      this.partnerDomain = this.partnerMapper.toDomain(partner);
      // Comprobamos si ya exsite el email
      const partnerExists = await this.partnerRepository.getById(
        partner.partner_id
      );
      const originalEmail = partnerExists.email.value.toLowerCase();
      // Verificar si el email ha cambiado
      if (partner.email.toLowerCase() !== originalEmail) {
        // Realizar la consulta para verificar duplicados
        const isEmailDuplicate =
          await this.partnerRepository.checkPartnerExistenceByEmail(
            partner.email
          );

        if (isEmailDuplicate) {
          Logger.error(
            `UpdatePartnerUseCase : PartnerAlreadyExistsError : ${this.partnerDomain.email.value}`
          );
          throw new PartnerAlreadyExistsError(this.partnerDomain.email.value);
        }
      }

      const result = await this.partnerRepository.update(this.partnerDomain);
      return result;
    } catch (error) {
      if (error instanceof DomainValidationError) {
        Logger.error(
          `UpdarePartnerUseCase : DomainValidationError : email invalid`
        );
        throw new DomainValidationError(error.message);
      }
      throw error;
    }
  }

  async updateAccessCode(accessCode: string, partnerId: string): Promise<void> {
    const result = await this.partnerRepository.updateAccessCode(
      accessCode,
      partnerId
    );
    return result;
  }

  async updatePartnerCash(
    amount: string,
    operation: OperationPartnerCash,
    partner: IPartnerDTO,
    user: string
  ): Promise<void> {
    const partnerDomain = this.partnerMapper.toDomain(partner);
    let final = 0;
    const getActualCash = await this.partnerRepository.getPartnerCash(
      partner.partner_id
    );
    final = await this.cashService.updatePartnerCash(
      amount,
      getActualCash.cash,
      operation,
      partnerDomain,
      this.incomeObject,
      this.paymentObject,
      user
    );
    // const actual = Number(getActualCash.cash) * 100;
    // const income = Number(amount) * 100;

    // if (income <= 0) {
    //   throw new MinZeroError();
    // }

    // if (isNaN(income) || isNaN(actual)) {
    //   throw new InvalidAmountError();
    // }

    // if (operation === OperationPartnerCash.REFUND) {
    //   final = actual - income;
    //   if (final < 0) {
    //     throw new MaxRefundLimitError();
    //   }
    //   final /= 100;
    //   await this.createRefundTransaction(final, operation, partnerDomain, user);
    // } else if (operation === OperationPartnerCash.WITHDRAWAL) {
    //   final = actual - income;
    //   final /= 100;
    //   if (final < partner.debt_limit!) {
    //     throw new MaxDebtLimitError();
    //   }
    // } else if (operation === OperationPartnerCash.INCOME) {
    //   final = actual + income;
    //   final /= 100;
    //   await this.createIncomeTransaction(final, operation, partnerDomain, user);
    // }

    const result = await this.partnerRepository.updatePartnerCash(
      final,
      partner.partner_id
    );

    return result;
  }

  // private async createIncomeTransaction(
  //   amount: number,
  //   operation: OperationPartnerCash,
  //   partner: IPartner,
  //   user: string
  // ): Promise<void> {
  //   const incomePromise = this.incomeObject.create({
  //     transaction_id: undefined,
  //     code: undefined,
  //     amount: amount,
  //     notes: operation,
  //     transaction_type_id: TransactionsTypes.INGRESO_CUENTA_SOCIO.toString(),
  //     recurrence_days: 0,
  //     recurrence_times: 0,
  //     date_start: DatetimeHelperService.dateToString(new Date()),
  //     interest: 0,
  //     user_created: user,
  //   });

  //   const paymentPromise = this.paymentObject.create({
  //     type: PaymentType.COBRO,
  //     reference_id: partner.partner_id.value,
  //     amount: amount,
  //     notes: operation,
  //     user_created: user,
  //   });

  //   await Promise.all([incomePromise, paymentPromise]);
  // }

  // private async createRefundTransaction(
  //   amount: number,
  //   operation: OperationPartnerCash,
  //   partner: IPartner,
  //   user: string
  // ): Promise<void> {
  //   const incomePromise = this.incomeObject.create({
  //     transaction_id: undefined,
  //     code: undefined,
  //     amount: amount,
  //     notes: operation,
  //     transaction_type_id: TransactionsTypes.REINTEGRO_CUENTA_SOCIO.toString(),
  //     recurrence_days: 0,
  //     recurrence_times: 0,
  //     date_start: DatetimeHelperService.dateToString(new Date()),
  //     interest: 0,
  //     user_created: user,
  //   });

  //   const paymentPromise = this.paymentObject.create({
  //     type: PaymentType.PAGO,
  //     reference_id: partner.partner_id.value,
  //     amount: amount,
  //     notes: operation,
  //     user_created: user,
  //   });

  //   await Promise.all([incomePromise, paymentPromise]);
  // }
}
