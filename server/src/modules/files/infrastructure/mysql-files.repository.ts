import { isNil } from "../../../../shared/type-checkers";
import Logger from "../../../apps/utils/logger";
import { MysqlDataBase } from "../../shared/infraestructure/mysql/mysql";
import { IFilesRepository } from "../domain/file.repository";
import { IFiles } from "../domain/files";
import {
  FileDoesNotExistError,
  NoRefererenceError,
} from "../domain/files.exceptions";
import { FilesMapper } from "./files.mapper";

export class MysqlFilesRepository implements IFilesRepository {
  private filesMapper = new FilesMapper();

  async getFile(filesId: string): Promise<IFiles> {
    const rows = await MysqlDataBase.query(
      `SELECT * FROM files WHERE file_id = ? and deleted_at is null`,
      [filesId]
    );
    if (isNil(rows[0])) {
      Logger.error(`mysql : getById : FileDoesNotExistError`);
      throw new FileDoesNotExistError("El fichero no existe");
    }
    return this.filesMapper.toDomain(rows[0]);
  }
  async getFiles(entityId: string): Promise<IFiles[]> {
    const rows = await MysqlDataBase.query(
      `SELECT * FROM files where deleted_at is null`
    );
    if (rows.length === 0) {
      Logger.error(`mysql : getAll : FileDoesNotExistError`);
      throw new FileDoesNotExistError("El fichero no existe");
    }
    return this.filesMapper.toDomainList(rows);
  }

  async uploadFile(file: IFiles): Promise<void> {
    const entityFile = this.filesMapper.toPersistence(file);
    let referenceColumnName: string | null = null;
    let referenceId: string | null = null;

    // Determinar qué referencia se está introduciendo
    if (file.partner_id) {
      referenceColumnName = "partner_id";
      referenceId = file.partner_id;
    } else if (file.product_id) {
      referenceColumnName = "product_id";
      referenceId = file.product_id;
    } else if (file.provider_id) {
      referenceColumnName = "provider_id";
      referenceId = file.provider_id;
    }

    if (!referenceColumnName || !referenceId) {
      throw new Error("No se proporcionó ninguna referencia válida");
    }

    const result = await MysqlDataBase.update(
      `INSERT INTO files (file_name, file_type_id, document_url, ${referenceColumnName}) VALUES (?, ?, ?, ?)`,
      [
        entityFile.file_name,
        entityFile.file_type_id.toString(),
        entityFile.document_url,
        referenceId,
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
      throw new FileDoesNotExistError("El fichero no existe");
    }
    return result;
  }
}
