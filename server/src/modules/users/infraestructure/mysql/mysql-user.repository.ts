import { isNil } from "../../../../../shared/type-checkers";
import Logger from "../../../../apps/utils/logger";
import { MysqlDataBase } from "../../../shared/infraestructure/mysql/mysql";
import {
  IUserRepository,
  IUser,
  UserDoesNotExistError,
  UsersNotFoundError,
} from "../../domain";
import { UserPersistenceMapper } from "../user-persistence.mapper";

export class MySqlUserRepository implements IUserRepository {
  private userPersistenceMapper: UserPersistenceMapper =
    new UserPersistenceMapper();

  async getById(id: string): Promise<IUser> {
    const rows = await MysqlDataBase.query(
      `SELECT user_id, email, password, role_id, active, user_created, user_updated, created_at, updated_at, deleted_at FROM users WHERE user_id = ? and deleted_at is null`,
      [id]
    );
    if (isNil(rows[0])) {
      Logger.error(`mysql : getById : UserDoesNotExistError`);
      throw new UserDoesNotExistError();
    }

    return this.userPersistenceMapper.toDomain(rows[0]) as IUser;
  }

  async getAll(): Promise<IUser[]> {
    const rows = await MysqlDataBase.query(`SELECT 
    user_id, email, password, role_id, active, user_created, user_updated, created_at, updated_at 
    FROM users where deleted_at is null`);
    if (rows.length === 0) {
      Logger.error(`mysql : getAll : UsersNotFoundError`);
      throw new UsersNotFoundError();
    }
    return this.userPersistenceMapper.toDomainList(rows) as IUser[];
  }

  async create(user: IUser): Promise<void> {
    const userPersistence = this.userPersistenceMapper.toPersistence(user);

    const result = await MysqlDataBase.update(
      "INSERT INTO users SET user_id = ?, email = ?, password = ?, role_id = ?",
      [
        userPersistence.user_id!.toString(),
        userPersistence.email.toString(),
        userPersistence.passwordHash!.toString(),
        userPersistence.role_id!.toString(),
      ]
    );
  }

  async update(user: IUser): Promise<void> {
    const userPersistence = this.userPersistenceMapper.toPersistence(user);
    const uid = userPersistence.user_id!.toString();
    const result = await MysqlDataBase.update(
      "UPDATE users SET email = ? WHERE user_id = ?",
      [userPersistence.email, uid]
    );
    if (result.affectedRows === 0) {
      Logger.error(`mysql : updateUser : UserDoesNotExistError`);
      throw new UserDoesNotExistError();
    }
  }

  async updateRole(user: IUser): Promise<void> {
    const userPersistence = this.userPersistenceMapper.toPersistence(user);
    const uid = userPersistence.user_id!.toString();
    const role_id = userPersistence.role_id.toString();
    const result = await MysqlDataBase.update(
      "UPDATE users SET role_id = ? WHERE user_id = ?",
      [role_id, uid]
    );
    if (result.affectedRows === 0) {
      Logger.error(`mysql : changeRole : UserDoesNotExistError`);
      throw new UserDoesNotExistError();
    }
  }

  async updatePassword(user: IUser): Promise<void> {
    const userPersistence = this.userPersistenceMapper.toPersistence(user);
    const uid = userPersistence.user_id!.toString();
    const passwordHash = userPersistence.passwordHash!.toString();
    const result = await MysqlDataBase.update(
      "UPDATE users SET password = ?, password_last_reset = NOW() WHERE user_id = ?; INSERT INTO password_history (user_id, password) VALUES (?, ?);",
      [passwordHash, uid, uid, passwordHash]
    );
    if (result.affectedRows === 0) {
      Logger.error(`mysql : updatePassword : UserDoesNotExistError`);
      throw new UserDoesNotExistError();
    }
  }

  async delete(id: string): Promise<void> {
    const result = await MysqlDataBase.update(
      `UPDATE users SET deleted_at = NOW() WHERE user_id = ?`,
      [id]
    );
    if (result.affectedRows === 0) {
      Logger.error(`mysql : deleteUser : UserDoesNotExistError`);
      throw new UserDoesNotExistError();
    }
  }

  async findByEmail(email: string): Promise<IUser> {
    const rows = await MysqlDataBase.query(
      `SELECT 
      user_id, email, password, role_id, active
      FROM users WHERE email = ? and deleted_at is null`,
      [email]
    );
    if (isNil(rows[0])) {
      Logger.error(`mysql : findByEmail : UserDoesNotExistError`);
      throw new UserDoesNotExistError();
    }
    return this.userPersistenceMapper.toDomain(rows[0]) as IUser;
  }

  async checkUserExistenceByEmail(email: string): Promise<boolean> {
    const user = await MysqlDataBase.query(
      `SELECT
      user_id, email, password, role_id, active
      FROM users WHERE email = ? and deleted_at is null`,
      [email]
    );

    return !!user.length;
  }

  async getPasswordHistory(user_id: string): Promise<string[]> {
    const rows = await MysqlDataBase.query(
      `SELECT password FROM password_history WHERE user_id = ? ORDER BY created_at DESC LIMIT 5`,
      [user_id]
    );
    return rows;
  }

  async activateUser(id: string): Promise<void> {
    const result = await MysqlDataBase.update(
      "UPDATE users SET active = ? WHERE user_id = ?",
      ["1", id]
    );
    if (result.affectedRows === 0) {
      Logger.error(`mysql : activateUser : UserDoesNotExistError`);
      throw new UserDoesNotExistError();
    }
  }

  async blockUser(id: string): Promise<void> {
    const result = await MysqlDataBase.update(
      "UPDATE users SET active = ? WHERE user_id = ?",
      ["0", id]
    );
    if (result.affectedRows === 0) {
      Logger.error(`mysql : blockUser : UserDoesNotExistError`);
      throw new UserDoesNotExistError();
    }
  }
}
