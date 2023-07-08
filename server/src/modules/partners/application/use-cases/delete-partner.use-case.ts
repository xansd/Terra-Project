import { IPartnerRepository } from "../../domain/partner.repository";

export interface IDeletePartner {
  deletePartner(id: string, user: string): Promise<void>;
}

export class DeletePartnerUseCase implements IDeletePartner {
  constructor(private readonly partnerRepository: IPartnerRepository) {}

  async deletePartner(id: string, user: string): Promise<void> {
    const result = await this.partnerRepository.delete(id, user);
    return result;
  }

  async deleteSanction(id: string, user: string): Promise<void> {
    const result = await this.partnerRepository.deleteSanction(id, user);
    return result;
  }
}
