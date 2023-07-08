import { IDTOMapper } from "../../shared/application/dto-mapper.interface";
import { IHarvests, Harvests } from "../domain/harvests";
import { PurchaseCode } from "../domain/value-objects/code-id.value-object";
import { PurchaseID } from "../domain/value-objects/purchase-id.value.object";

export interface IHarvestsDTO {
  harvest_id: string;
  code?: string;
  provider_id: string;
  product_id: string;
  provider_name?: string;
  product_name?: string;
  cost_price?: number;
  sale_price?: number;
  fee_amount?: number;
  quantity?: number;
  notes?: string;
  stock?: number;
  loss?: number;
  manicured?: number;
  paid?: number;
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
    const harvest_id = dto.harvest_id
      ? PurchaseID.create(dto.harvest_id)
      : PurchaseID.create();
    const code = dto.code
      ? PurchaseCode.create(harvest_id, dto.code)
      : PurchaseCode.create(harvest_id);
    const provider_id = dto.provider_id;
    const product_id = dto.product_id;
    const provider_name = dto.provider_name;
    const product_name = dto.product_name;
    const cost_price = dto.cost_price;
    const sale_price = dto.sale_price;
    const fee_amount = dto.fee_amount;
    const quantity = dto.quantity;
    const notes = dto.notes;
    const stock = dto.stock;
    const loss = dto.loss;
    const manicured = dto.manicured;
    const paid = dto.paid;
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
      provider_name,
      product_name,
      cost_price,
      sale_price,
      fee_amount,
      quantity,
      notes,
      stock,
      loss,
      manicured,
      paid,
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
      harvest_id: domain.harvest_id.value,
      code: domain.code?.value,
      provider_id: domain.provider_id,
      product_id: domain.product_id,
      product_name: domain.product_name,
      provider_name: domain.provider_name,
      cost_price: domain.cost_price,
      sale_price: domain.sale_price,
      fee_amount: domain.fee_amount,
      quantity: domain.quantity,
      notes: domain.notes,
      stock: domain.stock,
      manicured: domain.manicured,
      loss: domain.loss,
      paid: domain.paid,
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
