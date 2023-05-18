import { IPartnerRepository } from "../../domain/partner.repository";

export interface IDeletePartner {
  deletePartner(id: string): Promise<void>;
}

export class DeletePartnerUseCase implements IDeletePartner {
  constructor(private readonly partnerRepository: IPartnerRepository) {}

  async deletePartner(id: string): Promise<void> {
    const result = await this.partnerRepository.delete(id);
    return result;
  }
}
