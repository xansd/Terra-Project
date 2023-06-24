import { IDTOMapper } from '../../shared/application/dto-mapper.interface';
import { IHarvests, Harvests } from '../domain/harvests';

export interface IHarvestsDTO {
  harvest_id: string;
  code?: string;
  provider_id: string;
  product_id: string;
  cost_price?: number;
  sale_price?: number;
  fee_amount?: number;
  quantity?: number;
  notes?: string;
  user_created?: string;
  user_updated?: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}

export class HarvestsMapper implements IDTOMapper<IHarvests, IHarvestsDTO> {
  constructor() {}
  // Convierte un DTO a un dominio
  toDomain(dto: IHarvestsDTO): IHarvests {
    const harvest_id = dto.harvest_id;
    const code = dto.code;
    const provider_id = dto.provider_id;
    const product_id = dto.product_id;
    const cost_price = dto.cost_price;
    const sale_price = dto.sale_price;
    const fee_amount = dto.fee_amount;
    const quantity = dto.quantity;
    const notes = dto.notes;
    const user_created = dto.user_created;
    const user_updated = dto.user_updated;
    const created_at = dto.created_at;
    const updated_at = dto.updated_at;
    const deleted_at = dto.deleted_at;

    const props = {
      harvest_id,
      code,
      provider_id,
      product_id,
      cost_price,
      sale_price,
      fee_amount,
      quantity,
      notes,
      user_created,
      user_updated,
      created_at,
      updated_at,
      deleted_at,
    };
    return Harvests.create(props);
  }

  // Convierte un dominio a un DTO
  toDTO(domain: IHarvests): IHarvestsDTO {
    return {
      harvest_id: domain.harvest_id,
      code: domain.code,
      provider_id: domain.provider_id,
      product_id: domain.product_id,
      cost_price: domain.cost_price,
      sale_price: domain.sale_price,
      fee_amount: domain.fee_amount,
      quantity: domain.quantity,
      notes: domain.notes,
      user_created: domain.user_created,
      user_updated: domain.user_updated,
      created_at: domain.created_at,
      updated_at: domain.updated_at,
      deleted_at: domain.deleted_at,
    };
  }

  // Convierte una lista de dominio a una lista de DTO
  toDTOList(domainList: IHarvests[]): IHarvestsDTO[] {
    return domainList.map((harvest) => this.toDTO(harvest));
  }

  // Convierte una lista de DTO a una lista de dominio
  toDomainList(dtoList: IHarvestsDTO[]): IHarvests[] {
    return dtoList.map((harvestDTO) => this.toDomain(harvestDTO));
  }
}
