import { IDTOMapper } from 'src/app/shared/application/dto-mapper.interface';
import { IFiles, Files, FilesTypes } from '../domain/files';
import { IFilesDTO } from './files.dto';

export class FilesDTOMapper implements IDTOMapper<IFiles, IFilesDTO> {
  constructor() {}
  // Convierte un objeto DTO a un dominio
  toDomain(dto: IFilesDTO): IFiles {
    return Files.create({
      file_id: dto.file_id,
      name: dto.name,
      type: dto.type as unknown as FilesTypes,
      url: dto.url,
      file: dto.file,
      is_public: dto.is_public,
      created_at: dto.created_at,
      partner_id: dto.partner_id,
      product_id: dto.product_id,
      provider_id: dto.provider_id,
      updated_at: dto.updated_at,
    });
  }

  // Convierte un dominio a un objeto DTO
  toDTO(domain: IFiles): IFilesDTO {
    const {
      file_id,
      name,
      type,
      url,
      file,
      is_public,
      created_at,
      partner_id,
      product_id,
      provider_id,
      updated_at,
    } = domain;
    return {
      file_id: file_id,
      name: name,
      type: type,
      url: url,
      file,
      is_public: is_public,
      created_at: created_at,
      partner_id: partner_id,
      product_id: product_id,
      provider_id: provider_id,
      updated_at: updated_at,
    };
  }

  // Convierte una lista de dominio a una lista de DTO
  toDTOList(domainList: IFiles[]): IFilesDTO[] {
    return domainList.map((files) => this.toDTO(files));
  }

  // Convierte una lista de DTO a una lista de dominio
  toDomainList(dtoList: IFilesDTO[]): IFiles[] {
    return dtoList.map((filesDTO) => this.toDomain(filesDTO));
  }
}
