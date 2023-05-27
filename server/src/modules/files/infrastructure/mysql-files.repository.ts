import { isNil } from "../../../../shared/type-checkers";
import Logger from "../../../apps/utils/logger";
import { MysqlDataBase } from "../../shared/infraestructure/mysql/mysql";
import { IFilesRepository } from "../domain/file.repository";
import { IFiles, IFilesType } from "../domain/files";
import {
  FileDoesNotExistError,
  NoRefererenceError,
} from "../domain/files.exceptions";
import { FilesMapper } from "./files.mapper";

export class MysqlFilesRepository implements IFilesRepository {
  private filesMapper = new FilesMapper();

  async getFile(filesId: string): Promise<IFiles> {
    const rows = await MysqlDataBase.query(
      `SELECT * FROM files WHERE file_id = ? and deleted_at IS NULL`,
      [filesId]
    );
    if (isNil(rows[0])) {
      Logger.error(`mysql : getById : FileDoesNotExistError`);
      throw new FileDoesNotExistError();
    }
    return this.filesMapper.toDomain(rows[0]);
  }

  async getFiles(entityId: string): Promise<IFiles[]> {
    const rows = await MysqlDataBase.query(
      `SELECT * FROM files WHERE deleted_at IS NULL AND reference_id = ?
      `,
      [entityId]
    );
    if (rows.length === 0) {
      Logger.error(`mysql : getAll : FileDoesNotExistError`);
      throw new FileDoesNotExistError();
    }
    return this.filesMapper.toDomainList(rows);
  }

  async getTypes(): Promise<IFilesType[]> {
    const rows = await MysqlDataBase.query(`SELECT * FROM file_type`);
    return rows as unknown as IFilesType[];
  }

  async uploadFile(file: IFiles): Promise<void> {
    const entityFile = this.filesMapper.toPersistence(file);

    if (!file.reference_id) {
      throw new Error("No se proporcionó ninguna referencia válida");
    }

    const result = await MysqlDataBase.update(
      `INSERT INTO files (file_name, file_type_id, document_url, reference_id, policy) VALUES (?, ?, ?, ?, ?)`,
      [
        entityFile.file_name,
        entityFile.file_type_id.toString(),
        entityFile.document_url!,
        entityFile.reference_id!,
        entityFile.policy!,
      ]
    );

    if (result.affectedRows === 0) {
      throw new NoRefererenceError();
    }
    return result;
  }

  async deleteFile(fileId: string): Promise<void> {
    const result = await MysqlDataBase.update(
      `UPDATE files SET deleted_at = NOW() WHERE file_id = ?`,
      [fileId]
    );
    if (result.affectedRows === 0) {
      Logger.error(`mysql : deleteFile : FileDoesNotExistError`);
      throw new FileDoesNotExistError();
    }
    return result;
  }
}
