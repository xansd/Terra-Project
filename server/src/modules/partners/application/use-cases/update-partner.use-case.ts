import Logger from "../../../../apps/utils/logger";
import { DomainValidationError } from "../../../shared/domain/domain-validation.exception";
import { IPartner } from "../../domain/partner";
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

      const result = await this.userRepository.update(this.partnerDomain);
      return result;
    } catch (error) {
      if (error instanceof DomainValidationError) {
        Logger.error(
          `CreatePartnerUseCase : DomainValidationError : email invalid`
        );
        throw new DomainValidationError(error.message);
      }
    }
  }
}
