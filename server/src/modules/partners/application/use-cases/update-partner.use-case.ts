import Logger from "../../../../apps/utils/logger";
import { DomainValidationError } from "../../../shared/domain/domain-validation.exception";
import { IPartner } from "../../domain/partner";
import { PartnerAlreadyExistsError } from "../../domain/partner.exceptions";
import { IPartnerRepository } from "../../domain/partner.repository";
import { PartnerMapper } from "../partner-dto.mapper";
import { IPartnerDTO } from "../partner.dto";

export interface IUpdatePartner {
  updatePartner(partner: IPartnerDTO): Promise<IPartner | undefined>;
}

export class UpdatePartnerUseCase implements IUpdatePartner {
  private partnerMapper: PartnerMapper = new PartnerMapper();
  partnerDomain!: IPartner;

  constructor(private readonly userRepository: IPartnerRepository) {}

  async updatePartner(partner: IPartnerDTO): Promise<IPartner | undefined> {
    try {
      this.partnerDomain = this.partnerMapper.toDomain(partner);
      // Comprobamo si ya exsite el email
      const partnerExists = await this.userRepository.getById(
        partner.partner_id
      );
      const originalEmail = partnerExists.email;
      // Verificar si el email ha cambiado
      if (partner.email !== originalEmail.value) {
        // Realizar la consulta para verificar duplicados
        const isEmailDuplicate =
          await this.userRepository.checkPartnerExistenceByEmail(partner.email);

        if (isEmailDuplicate) {
          Logger.error(
            `UpdatePartnerUseCase : PartnerAlreadyExistsError : ${this.partnerDomain.email.value}`
          );
          throw new PartnerAlreadyExistsError(this.partnerDomain.email.value);
        }
      }

      const result = await this.userRepository.update(this.partnerDomain);
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
}
