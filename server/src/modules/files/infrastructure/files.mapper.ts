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
      policy: persistence.policy,
      reference_id: persistence.reference_id,
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
      policy,
      reference_id,
      created_at,
      updated_at,
    } = domain;
    return {
      file_id: file_id,
      file_name: name,
      document_url: url,
      file_type_id: type as unknown as number,
      file: file,
      policy: policy,
      reference_id: reference_id,
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

  async createIFilesFromStream(
    stream: Buffer,
    fileObject: IFiles
  ): Promise<IFiles> {
    const file: IFiles = {
      file_id: fileObject.file_id,
      name: fileObject.name,
      url: fileObject.url,
      type: fileObject.type,
      policy: fileObject.policy,
      created_at: fileObject.created_at,
      updated_at: fileObject.updated_at,
      file: stream,
    };

    return file;
  }
}
