import { ProductsType } from "../../products/domain/products";
import { IDTOMapper } from "../../shared/application/dto-mapper.interface";
import { Email } from "../../shared/domain/value-objects/email.value-object";
import { IProvider, Provider } from "../domain/providers";
import { ProviderID } from "../domain/value-objects/provider-id.value.object";

export interface IProviderDTO {
  provider_id: string;
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  type: ProductsType;
  user_created?: string;
  user_updated?: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}

export class ProviderMapper implements IDTOMapper<IProvider, IProviderDTO> {
  constructor() {}
  // Convierte un DTO a un dominio
  toDomain(dto: IProviderDTO): IProvider {
    const provider_id = dto.provider_id
      ? ProviderID.create(dto.provider_id)
      : ProviderID.create();
    const name = dto.name;
    const email = Email.create(dto.email!);
    const phone = dto.phone;
    const address = dto.address;
    const type = dto.type;
    const user_created = dto.user_created;
    const user_updated = dto.user_updated;
    const created_at = dto.created_at;
    const updated_at = dto.updated_at;
    const deleted_at = dto.deleted_at;

    const props = {
      provider_id,
      name,
      email,
      phone,
      address,
      type,
      user_created,
      user_updated,
      created_at,
      updated_at,
      deleted_at,
    };
    return Provider.create(props);
  }

  // Convierte un dominio a un DTO
  toDTO(domain: IProvider): IProviderDTO {
    return {
      provider_id: domain.provider_id.value,
      name: domain.name,
      email: domain.email?.value,
      phone: domain.phone,
      address: domain.address,
      type: domain.type,
      user_created: domain.user_created,
      user_updated: domain.user_updated,
      created_at: domain.created_at,
      updated_at: domain.updated_at,
      deleted_at: domain.deleted_at,
    };
  }

  // Convierte una lista de dominio a una lista de DTO
  toDTOList(domainList: IProvider[]): IProviderDTO[] {
    return domainList.map((provider) => this.toDTO(provider));
  }

  // Convierte una lista de DTO a una lista de dominio
  toDomainList(dtoList: IProviderDTO[]): IProvider[] {
    return dtoList.map((providerDTO) => this.toDomain(providerDTO));
  }
}
