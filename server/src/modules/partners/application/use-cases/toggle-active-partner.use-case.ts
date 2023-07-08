import { IPartnerRepository } from "../../domain/partner.repository";
import { PartnerMapper } from "../partner-dto.mapper";

export interface IToggleActivePartnerUseCase {
  makeActive(id: string, user: string): Promise<void>;
  makeInactive(id: string, user: string): Promise<void>;
  partnerLeaves(id: string, user: string): Promise<void>;
}

export class ToggleActivePartnerUseCase implements IToggleActivePartnerUseCase {
  partnerMapper: PartnerMapper = new PartnerMapper();
  constructor(private readonly partnerRepository: IPartnerRepository) {}

  async makeActive(id: string, user: string): Promise<void> {
    const result = await this.partnerRepository.makeActive(id, user);
    return result;
  }

  async makeInactive(id: string, user: string): Promise<void> {
    const result = await this.partnerRepository.makeInactive(id, user);
    return result;
  }

  async partnerLeaves(id: string, user: string): Promise<void> {
    const result = await this.partnerRepository.partnerLeaves(id, user);
    return result;
  }
}
