import Logger from "../../../../apps/utils/logger";
import { IPartner } from "../../domain/partner";
import { PartnerDoesNotExistError } from "../../domain/partner.exceptions";
import { PartnersNotFoundError } from "../../domain/partner.exceptions";
import { IPartnerRepository } from "../../domain/partner.repository";

export interface IGetPartner {
  getPartner(id: string): Promise<IPartner>;
}

export interface IGetAllPartners {
  getAllPartners(): Promise<IPartner[]>;
}

export class GetPartnerUseCase implements IGetPartner, IGetAllPartners {
  constructor(private readonly partnerRepository: IPartnerRepository) {}

  async getPartner(id: string): Promise<IPartner> {
    const partner = await this.partnerRepository.getById(id);
    if (!partner) {
      Logger.error(
        `partner-repository : getPartner : ${PartnerDoesNotExistError}`
      );
      throw new PartnerDoesNotExistError();
    }
    return partner;
  }

  async getAllPartners(): Promise<IPartner[]> {
    const partners = await this.partnerRepository.getAll();
    if (partners.length === 0) {
      const partnersNotFound = new PartnersNotFoundError();
      Logger.error(
        `partner-repository : getAllPartners : ${PartnersNotFoundError}`
      );
      throw partnersNotFound;
    }

    return partners;
  }
}
