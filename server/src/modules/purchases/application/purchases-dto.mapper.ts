import { IDTOMapper } from "../../shared/application/dto-mapper.interface";
import { IPurchase, IPurchaseDetails, Purchase } from "../domain/purchases";
import { PurchaseCode } from "../domain/value-objects/code-id.value-object";
import { PurchaseID } from "../domain/value-objects/purchase-id.value.object";

export interface IPurchaseDTO {
  purchase_id: string;
  code?: string;
  provider_id: string;
  total_amount?: number;
  purchase_details: IPurchaseDetails[];
  notes?: string;
  user_created?: string;
  user_updated?: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}

export class PurchasesMapper implements IDTOMapper<IPurchase, IPurchaseDTO> {
  constructor() {}
  // Convierte un DTO a un dominio
  toDomain(dto: IPurchaseDTO): IPurchase {
    const purchase_id = dto.purchase_id
      ? PurchaseID.create(dto.purchase_id)
      : PurchaseID.create();
    const code = dto.code
      ? PurchaseCode.create(purchase_id, dto.code)
      : PurchaseCode.create(purchase_id);
    const provider_id = dto.provider_id;
    const total_amount = dto.total_amount;
    const purchase_details = dto.purchase_details;
    const notes = dto.notes;
    const user_created = dto.user_created;
    const user_updated = dto.user_updated;
    const created_at = dto.created_at;
    const updated_at = dto.updated_at;
    const deleted_at = dto.deleted_at;

    const props = {
      purchase_id,
      code,
      provider_id,
      total_amount,
      purchase_details,
      notes,
      user_created,
      user_updated,
      created_at,
      updated_at,
      deleted_at,
    };
    return Purchase.create(props);
  }

  // Convierte un dominio a un DTO
  toDTO(domain: IPurchase): IPurchaseDTO {
    return {
      purchase_id: domain.purchase_id.value,
      code: domain.code?.value,
      provider_id: domain.provider_id,
      total_amount: domain.total_amount,
      purchase_details: domain.purchase_details,
      notes: domain.notes,
      user_created: domain.user_created,
      user_updated: domain.user_updated,
      created_at: domain.created_at,
      updated_at: domain.updated_at,
      deleted_at: domain.deleted_at,
    };
  }

  // Convierte una lista de dominio a una lista de DTO
  toDTOList(domainList: IPurchase[]): IPurchaseDTO[] {
    return domainList.map((purchase) => this.toDTO(purchase));
  }

  // Convierte una lista de DTO a una lista de dominio
  toDomainList(dtoList: IPurchaseDTO[]): IPurchase[] {
    return dtoList.map((purchaseDTO) => this.toDomain(purchaseDTO));
  }
}
