import { IDTOMapper } from "../../shared/application/dto-mapper.interface";
import { IPayments, PaymentType, Payments } from "../domain/payments";

export interface IPaymentsDTO {
  payment_id?: string;
  type: PaymentType;
  reference_id: string;
  amount?: number;
  notes?: string;
  user_created?: string;
  user_updated?: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}

export class PaymentMapper implements IDTOMapper<IPayments, IPaymentsDTO> {
  constructor() {}
  // Convierte un DTO a un dominio
  toDomain(dto: IPaymentsDTO): IPayments {
    const {
      payment_id,
      type,
      reference_id,
      amount,
      notes,
      user_created,
      user_updated,
      created_at,
      updated_at,
      deleted_at,
    } = dto;

    const props = {
      payment_id,
      type,
      reference_id,
      amount,
      notes,
      user_created,
      user_updated,
      created_at,
      updated_at,
      deleted_at,
    };
    return Payments.create(props);
  }

  // Convierte un dominio a un DTO
  toDTO(domain: IPayments): IPaymentsDTO {
    return {
      payment_id: domain.payment_id,
      type: domain.type,
      reference_id: domain.reference_id,
      amount: domain.amount,
      notes: domain.notes,
      user_created: domain.user_created,
      user_updated: domain.user_updated,
      created_at: domain.created_at,
      updated_at: domain.updated_at,
      deleted_at: domain.deleted_at,
    };
  }

  // Convierte una lista de dominio a una lista de DTO
  toDTOList(domainList: IPayments[]): IPaymentsDTO[] {
    return domainList.map((Payment) => this.toDTO(Payment));
  }

  // Convierte una lista de DTO a una lista de dominio
  toDomainList(dtoList: IPaymentsDTO[]): IPayments[] {
    return dtoList.map((PaymentDTO) => this.toDomain(PaymentDTO));
  }
}
