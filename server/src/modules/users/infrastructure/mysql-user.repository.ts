import { isNil } from "../../../../shared/type-checkers";
import Logger from "../../../apps/utils/logger";
import { MysqlDataBase } from "../../shared/infraestructure/mysql/mysql";
import {
  IUserRepository,
  IUser,
  UserDoesNotExistError,
  UsersNotFoundError,
  InvalidCredentialsError,
  Role,
} from "../domain";
import { UserPersistenceMapper } from "./user-persistence.mapper";

export class MySqlUserRepository implements IUserRepository {
  private userPersistenceMapper: UserPersistenceMapper =
    new UserPersistenceMapper();

  async getById(id: string): Promise<IUser> {
    const rows = await MysqlDataBase.query(
      `SELECT user_id, email, password, role_id, active, password_last_reset, user_created, user_updated, created_at, updated_at, deleted_at FROM users WHERE user_id = ? and deleted_at IS NULL`,
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
    user_id, email, password, role_id, active, password_last_reset, user_created, user_updated, created_at, updated_at 
    FROM users where deleted_at IS NULL  ORDER BY created_at ASC`);
    if (rows.length === 0) {
      Logger.error(`mysql : getAll : UsersNotFoundError`);
      throw new UsersNotFoundError();
    }
    return this.userPersistenceMapper.toDomainList(rows) as IUser[];
  }

  async create(
    user_id: string,
    email: string,
    passwordhash: string,
    role_id: number
  ): Promise<IUser> {
    const insertQuery = `INSERT INTO users (user_id, email, password, role_id) VALUES (?,?,?,?)`;

    const selectQuery = `SELECT user_id, email, password, role_id, active, password_last_reset, user_created, user_updated, created_at, updated_at, deleted_at
    FROM users ORDER BY created_at DESC LIMIT 1`;
    const insertResult = await MysqlDataBase.update(insertQuery, [
      user_id,
      email,
      passwordhash,
      role_id.toString(),
    ]);
    const selectResult = await MysqlDataBase.query(selectQuery);
    const user = selectResult[0];

    return this.userPersistenceMapper.toDomain(user);
  }

  async updateRole(id: string, role: Role): Promise<void> {
    const result = await MysqlDataBase.update(
      "UPDATE users SET role_id = ? WHERE user_id = ?",
      [role.toString(), id]
    );
    if (result.affectedRows === 0) {
      Logger.error(`mysql : changeRole : UserDoesNotExistError`);
      throw new UserDoesNotExistError();
    }
    return result;
  }

  async updatePassword(data: {
    id: string;
    newPassword: string;
  }): Promise<void> {
    const uid = data.id.toString();
    const passwordHash = data.newPassword.toString();
    const updatePassword = await MysqlDataBase.update(
      "UPDATE users SET password = ?, password_last_reset = NOW() WHERE user_id = ?",
      [passwordHash, uid]
    );
    const updateHistory = await MysqlDataBase.update(
      "INSERT INTO password_history (user_id, password) VALUES (?, ?);",
      [uid, passwordHash]
    );
    if (updatePassword.affectedRows === 0) {
      Logger.error(`mysql : updatePassword : UserDoesNotExistError`);
      throw new UserDoesNotExistError();
    }
    return updatePassword;
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
    return result;
  }

  async findByEmail(email: string): Promise<IUser> {
    const rows = await MysqlDataBase.query(
      `SELECT 
      user_id, email, password, role_id, active, password_last_reset
      FROM users WHERE email = ? and deleted_at IS NULL`,
      [email]
    );
    if (isNil(rows[0])) {
      Logger.error(`mysql : findByEmail : UserDoesNotExistError`);
      throw new InvalidCredentialsError();
      // throw new UserDoesNotExistError();
    }
    return this.userPersistenceMapper.toDomain(rows[0]) as IUser;
  }

  async checkUserExistenceByEmail(email: string): Promise<boolean> {
    const user = await MysqlDataBase.query(
      `SELECT
      user_id, email, password, role_id, active
      FROM users WHERE email = ? and deleted_at IS NULL`,
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
    return result;
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
    return result;
  }
}
