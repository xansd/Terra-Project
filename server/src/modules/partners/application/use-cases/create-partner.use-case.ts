import Logger from "../../../../apps/utils/logger";
import appConfig from "../../../../config/app-config";
import { DomainValidationError } from "../../../shared/domain/domain-validation.exception";
import { IPartner } from "../../domain/partner";
import { PartnerAlreadyExistsError } from "../../domain/partner.exceptions";
import { IPartnerRepository } from "../../domain/partner.repository";
import { PartnerMapper } from "../partner-dto.mapper";
import { IPartnerDTO } from "../partner.dto";

const CONFIG = appConfig;

export interface ICreatePartner {
  createPartner(partner: IPartnerDTO): Promise<IPartner | undefined>;
}

export class CreatePartnerUseCase implements ICreatePartner {
  private partnerMapper: PartnerMapper = new PartnerMapper();
  partnerDomain!: IPartner;

  constructor(private readonly partnerRepository: IPartnerRepository) {}

  async createPartner(partner: IPartnerDTO): Promise<IPartner | undefined> {
    // Comprobamos si el email ya existe en la tabla de socios
    try {
      this.partnerDomain = this.partnerMapper.toDomain(partner);
      const partnerExists =
        await this.partnerRepository.checkPartnerExistenceByEmail(
          this.partnerDomain.email.value
        );
      if (partnerExists) {
        Logger.error(
          `CreatePartnerUseCase : PartnerAlreadyExistsError : ${this.partnerDomain.email.value}`
        );
        throw new PartnerAlreadyExistsError(this.partnerDomain.email.value);
      }
      // Guardamos el socio en la base de datos
      const partnerRepository = await this.partnerRepository.create(
        this.partnerDomain
      );
      return partnerRepository;
    } catch (error) {
      if (error instanceof DomainValidationError) {
        Logger.error(
          `CreatePartnerUseCase : DomainValidationError : email invalid`
        );
        throw new DomainValidationError(error.message);
      }
      throw error;
    }
  }
}
