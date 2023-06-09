import Logger from "../../../../apps/utils/logger";
import { DomainValidationError } from "../../../shared/domain/domain-validation.exception";
import { IPartner } from "../../domain/partner";
import { PartnerAlreadyExistsError } from "../../domain/partner.exceptions";
import { IPartnerRepository } from "../../domain/partner.repository";
import { PartnerMapper } from "../partner-dto.mapper";
import { IPartnerDTO } from "../partner.dto";

export interface IUpdatePartner {
  updatePartner(partner: IPartnerDTO): Promise<void>;
}

export class UpdatePartnerUseCase implements IUpdatePartner {
  private partnerMapper: PartnerMapper = new PartnerMapper();
  partnerDomain!: IPartner;

  constructor(private readonly partnerRepository: IPartnerRepository) {}

  async updatePartner(partner: IPartnerDTO): Promise<void> {
    try {
      this.partnerDomain = this.partnerMapper.toDomain(partner);
      // Comprobamos si ya exsite el email
      const partnerExists = await this.partnerRepository.getById(
        partner.partner_id
      );
      const originalEmail = partnerExists.email;
      // Verificar si el email ha cambiado
      if (partner.email !== originalEmail.value) {
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

  async updatePartnerCash(amount: string, partnerId: string): Promise<void> {
    const actualCash = await this.partnerRepository.getPartnerCash(partnerId);
    const total = Number(actualCash.cash) + Number(amount);
    const result = await this.partnerRepository.updatePartnerCash(
      total,
      partnerId
    );
    return result;
  }
}
