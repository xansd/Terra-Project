import { IPersistenceMapper } from "../../shared/infraestructure/persistence-mapper.interface";
import { Files, FilesTypes, IFiles } from "../domain/files";
import { IFilesEntity } from "./files.entity";

export class FilesMapper implements IPersistenceMapper<IFiles, IFilesEntity> {
  toDomain(persistence: IFilesEntity): IFiles {
    return Files.create({
      file_id: persistence.file_id,
      name: persistence.file_name,
      url: persistence.document_url,
      type: persistence.file_type_id as unknown as FilesTypes,
      file: persistence.file,
      partner_id: persistence.partner_id,
      product_id: persistence.product_id,
      provider_id: persistence.provider_id,
      created_at: persistence.created_at,
      updated_at: persistence.updated_at,
    });
  }
  toPersistence(domain: IFiles): IFilesEntity {
    const {
      file_id,
      name,
      type,
      url,
      file,
      partner_id,
      product_id,
      provider_id,
      created_at,
      updated_at,
    } = domain;
    return {
      file_id: file_id,
      file_name: name,
      document_url: url,
      file_type_id: type as unknown as number,
      file: file,
      provider_id: provider_id,
      partner_id: partner_id,
      product_id: product_id,
      created_at: created_at,
      updated_at: updated_at,
    };
  }
  toPersistenceList(domainList: IFiles[]): IFilesEntity[] {
    return domainList.map((domainFile) => this.toPersistence(domainFile));
  }
  toDomainList(persistenceList: IFilesEntity[]): IFiles[] {
    return persistenceList.map((entityFile) => this.toDomain(entityFile));
  }
}
