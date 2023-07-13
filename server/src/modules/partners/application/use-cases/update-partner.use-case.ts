import Logger from "../../../../apps/utils/logger";
import { IFeesRepository } from "../../../fees/domain/fees.repository";
import { UpdatePayments } from "../../../payments/application/use-cases/update-payments.use-case";

import { IPaymentsRepository } from "../../../payments/domain/payments.repository";
import { IPurchasesRepository } from "../../../purchases/domain/purchases.repository";

import { DomainValidationError } from "../../../shared/domain/domain-validation.exception";
import { UpdateTransactions } from "../../../transactions/application/use-cases/update-transactions.use-case";

import { ITransactionsRepository } from "../../../transactions/domain/transactions.repository";
import { IPartner, OperationPartnerCash } from "../../domain/partner";
import { PartnerAlreadyExistsError } from "../../domain/partner.exceptions";
import { IPartnerRepository } from "../../domain/partner.repository";
import { PartnerMapper } from "../partner-dto.mapper";
import { IPartnerDTO } from "../partner.dto";
import { PartnerCashService } from "../services/partner-cash.service";

export interface IUpdatePartner {
  updatePartner(partner: IPartnerDTO): Promise<void>;
}

export class UpdatePartnerUseCase implements IUpdatePartner {
  incomeObject = new UpdateTransactions(this.transactionsRepository!);
  paymentObject = new UpdatePayments(
    this.paymentsRepository!,
    this.transactionsRepository!,
    this.purchasesRepository!,
    this.feesRepository!
  );

  private partnerMapper: PartnerMapper = new PartnerMapper();
  partnerDomain!: IPartner;

  constructor(
    private readonly partnerRepository?: IPartnerRepository,
    private readonly transactionsRepository?: ITransactionsRepository,
    private readonly paymentsRepository?: IPaymentsRepository,
    private readonly purchasesRepository?: IPurchasesRepository,
    private readonly cashService?: PartnerCashService,
    private readonly feesRepository?: IFeesRepository
  ) {}

  async updatePartner(partner: IPartnerDTO): Promise<void> {
    try {
      this.partnerDomain = this.partnerMapper.toDomain(partner);
      // Comprobamos si ya exsite el email
      const partnerExists = await this.partnerRepository!.getById(
        partner.partner_id
      );
      const originalEmail = partnerExists.email.value.toLowerCase();
      // Verificar si el email ha cambiado
      if (partner.email.toLowerCase() !== originalEmail) {
        // Realizar la consulta para verificar duplicados
        const isEmailDuplicate =
          await this.partnerRepository!.checkPartnerExistenceByEmail(
            partner.email
          );

        if (isEmailDuplicate) {
          Logger.error(
            `UpdatePartnerUseCase : PartnerAlreadyExistsError : ${this.partnerDomain.email.value}`
          );
          throw new PartnerAlreadyExistsError(this.partnerDomain.email.value);
        }
      }

      const result = await this.partnerRepository!.update(this.partnerDomain);
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

  async updateAccessCode(
    accessCode: string,
    partnerId: string,
    user: string
  ): Promise<void> {
    const result = await this.partnerRepository!.updateAccessCode(
      accessCode,
      partnerId,
      user
    );
    return result;
  }

  async updatePartnerCash(
    amount: string,
    operation: OperationPartnerCash,
    partner: IPartnerDTO,
    account: string,
    user: string
  ): Promise<void> {
    const partnerDomain = this.partnerMapper.toDomain(partner);
    let final = 0;
    const getActualCash = await this.partnerRepository!.getPartnerCash(
      partner.partner_id
    );
    final = await this.cashService!.updatePartnerCash(
      amount,
      getActualCash.cash,
      operation,
      partnerDomain,
      this.incomeObject,
      this.paymentObject,
      account,
      user
    );

    const result = await this.partnerRepository!.updatePartnerCash(
      final,
      partner.partner_id,
      user
    );

    return result;
  }
}
