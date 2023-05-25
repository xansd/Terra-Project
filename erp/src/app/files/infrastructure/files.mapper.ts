import { IDTOMapper } from 'src/app/shared/application/dto-mapper.interface';
import { IFiles, Files, FilesTypes, FilePolicy } from '../domain/files';
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
      policy: dto.policy,
      is_public: dto.is_public,
      created_at: dto.created_at,
      reference_id: dto.reference_id,
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
      policy,
      created_at,
      reference_id,
      updated_at,
    } = domain;
    return {
      file_id: file_id,
      name: name,
      type: type,
      url: url,
      file,
      is_public: is_public ? 1 : 0,
      policy: policy,
      created_at: created_at,
      reference_id: reference_id,
      updated_at: updated_at,
    };
  }

  toFormData(fileObject: {
    file: File;
    type: FilesTypes;
    referenceId: string;
    isPublic?: boolean;
    policy?: FilePolicy;
  }) {
    const formData = new FormData();
    formData.append('name', fileObject.file.name);
    formData.append('type', fileObject.type.toString());
    formData.append('reference_id', fileObject.referenceId.toString());
    formData.append('file', fileObject.file);

    if (fileObject.isPublic) {
      formData.append('is_public', '1');
    } else {
      formData.append('is_public', '0');
    }

    if (fileObject.policy) {
      formData.append('policy', fileObject.policy.toString());
    } else {
      formData.append('policy', FilePolicy.PRIVATE);
    }

    this.logFormData(formData);
    return formData;
  }

  logFormData(formData: FormData) {
    const object: Record<string, any> = {};
    formData.forEach((value, key) => {
      object[key] = value;
    });
    console.log(object);
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
