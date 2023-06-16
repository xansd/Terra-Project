import { IDTOMapper } from "../../shared/application/dto-mapper.interface";
import { ISales, ISalesDetails, Sales } from "../domain/sales";
import { SalesCode } from "../domain/value-objects/code-id.value-object";
import { SalesID } from "../domain/value-objects/sales-id.value.object";

export interface ISalesDTO {
  sale_id: string;
  code?: string;
  partner_id: string;
  discount?: number;
  tax?: number;
  total_amount: number;
  sale_details: ISalesDetails;
  notes?: string;
  user_created?: string;
  user_updated?: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}

export class SalesMapper implements IDTOMapper<ISales, ISalesDTO> {
  constructor() {}
  // Convierte un DTO a un dominio
  toDomain(dto: ISalesDTO): ISales {
    const sale_id = dto.sale_id
      ? SalesID.create(dto.sale_id)
      : SalesID.create();
    const code = dto.code
      ? SalesCode.create(sale_id, dto.code)
      : SalesCode.create(sale_id);
    const partner_id = dto.partner_id;
    const discount = dto.discount;
    const tax = dto.tax;
    const total_amount = dto.total_amount;
    const sale_details = dto.sale_details;
    const notes = dto.notes;
    const user_created = dto.user_created;
    const user_updated = dto.user_updated;
    const created_at = dto.created_at;
    const updated_at = dto.updated_at;
    const deleted_at = dto.deleted_at;

    const props = {
      sale_id,
      code,
      partner_id,
      discount,
      tax,
      total_amount,
      sale_details,
      notes,
      user_created,
      user_updated,
      created_at,
      updated_at,
      deleted_at,
    };
    return Sales.create(props);
  }

  // Convierte un dominio a un DTO
  toDTO(domain: ISales): ISalesDTO {
    return {
      sale_id: domain.sale_id.value,
      code: domain.code?.value,
      partner_id: domain.partner_id,
      discount: domain.discount,
      tax: domain.tax,
      total_amount: domain.total_amount,
      sale_details: domain.sale_details,
      notes: domain.notes,
      user_created: domain.user_created,
      user_updated: domain.user_updated,
      created_at: domain.created_at,
      updated_at: domain.updated_at,
      deleted_at: domain.deleted_at,
    };
  }

  // Convierte una lista de dominio a una lista de DTO
  toDTOList(domainList: ISales[]): ISalesDTO[] {
    return domainList.map((sale) => this.toDTO(sale));
  }

  // Convierte una lista de DTO a una lista de dominio
  toDomainList(dtoList: ISalesDTO[]): ISales[] {
    return dtoList.map((saleDTO) => this.toDomain(saleDTO));
  }
}
