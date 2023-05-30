import { IPartnerRepository } from "../../domain/partner.repository";
import { PartnerMapper } from "../partner-dto.mapper";

export interface IToggleActivePartnerUseCase {
  makeActive(id: string): Promise<void>;
  makeInactive(id: string): Promise<void>;
  partnerLeaves(id: string): Promise<void>;
}

export class ToggleActivePartnerUseCase implements IToggleActivePartnerUseCase {
  partnerMapper: PartnerMapper = new PartnerMapper();
  constructor(private readonly partnerRepository: IPartnerRepository) {}

  async makeActive(id: string): Promise<void> {
    const result = await this.partnerRepository.makeActive(id);
    return result;
  }

  async makeInactive(id: string): Promise<void> {
    const result = await this.partnerRepository.makeInactive(id);
    return result;
  }

  async partnerLeaves(id: string): Promise<void> {
    const result = await this.partnerRepository.partnerLeaves(id);
    return result;
  }
}
