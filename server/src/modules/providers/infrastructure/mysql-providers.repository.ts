import { isNil } from "../../../../shared/type-checkers";
import Logger from "../../../apps/utils/logger";
import { MysqlDataBase } from "../../shared/infraestructure/mysql/mysql";
import { IProvider } from "../domain/providers";
import {
  ProviderDoesNotExistError,
  ProvidersNotFoundError,
} from "../domain/providers.exceptions";
import { IProviderRepository } from "../domain/providers.repository";
import { ProvidersPersistenceMapper } from "./providers-persistence.mapper";

export class MySqlProvidersRepository implements IProviderRepository {
  private providersPersistenceMapper: ProvidersPersistenceMapper =
    new ProvidersPersistenceMapper();

  async getById(providerId: string): Promise<IProvider> {
    const rows = await MysqlDataBase.query(
      `SELECT * from providers WHERE provider_id = ? AND deleted_at IS NULL`,
      [providerId]
    );
    if (isNil(rows[0])) {
      Logger.error(`mysql : getById : ProviderDoesNotExistError`);
      throw new ProviderDoesNotExistError();
    }

    return this.providersPersistenceMapper.toDomain(rows[0]) as IProvider;
  }
  async getAll(type: string): Promise<IProvider[]> {
    const rows = await MysqlDataBase.query(
      `SELECT * FROM providers WHERE type = ? AND deleted_at IS NULL`,
      [type]
    );
    if (rows.length === 0) {
      Logger.error(`mysql : getAll : ProvidersNotFoundError`);
      throw new ProvidersNotFoundError();
    }
    return this.providersPersistenceMapper.toDomainList(rows) as IProvider[];
  }
  async create(provider: IProvider, user: string): Promise<IProvider> {
    const providerPersistence =
      this.providersPersistenceMapper.toPersistence(provider);
    const insertQuery = `INSERT INTO providers (provider_id, name, email, phone, address, type, user_created) VALUES (?,?,?,?,?,?,?)`;

    const selectQuery = `SELECT * FROM providers ORDER BY created_at DESC LIMIT 1`;

    const insertResult = await MysqlDataBase.update(insertQuery, [
      providerPersistence.provider_id,
      providerPersistence.name!,
      providerPersistence.email!,
      providerPersistence.phone!,
      providerPersistence.address!,
      providerPersistence.type,
      user,
    ]);
    const selectResult = await MysqlDataBase.query(selectQuery);
    const providerSaved = selectResult[0];

    Logger.info(`mysql : createProvider : ${user}`);
    return this.providersPersistenceMapper.toDomain(providerSaved);
  }
  async update(provider: IProvider, user: string): Promise<void> {
    const providersPersistence =
      this.providersPersistenceMapper.toPersistence(provider);
    const result = await MysqlDataBase.update(
      `UPDATE providers SET name = ?, email = ?, phone = ?, address = ?, type = ?, user_updated = ? WHERE provider_id = ?`,
      [
        providersPersistence.name!,
        providersPersistence.email!,
        providersPersistence.phone!,
        providersPersistence.address!,
        providersPersistence.type!,
        user,
        providersPersistence.provider_id,
      ]
    );
    if (result.affectedRows === 0) {
      Logger.error(`mysql : update : ProviderDoesNotExistError`);
      throw new ProviderDoesNotExistError();
    }
    Logger.info(`mysql : updateProvider : ${user}`);
    return result;
  }
  async delete(providerId: string, user: string): Promise<void> {
    const result = await MysqlDataBase.update(
      // `UPDATE providers SET deleted_at = NOW(), user_updated = ? WHERE provider_id = ?`,
      // [user, providerId]
      `DELETE FROM providers WHERE provider_id = ?`,
      [providerId]
    );
    if (result.affectedRows === 0) {
      Logger.error(`mysql : delete : ProviderDoesNotExistError`);
      throw new ProviderDoesNotExistError();
    }
    Logger.info(`mysql : deleteProvider : ${user}`);
    return result;
  }
  async checkProviderExistenceByName(name: string): Promise<boolean> {
    const product = await MysqlDataBase.query(
      `SELECT * FROM providers WHERE name = ? and deleted_at IS NULL`,
      [name]
    );
    return !!product.length;
  }
}
