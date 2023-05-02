import { isNil } from "../../../../../shared/type-checkers";
import Logger from "../../../shared/infraestructure/logger";
import { MysqlDataBase } from "../../../shared/infraestructure/mysql/mysql";
import {
  IUserRepository,
  IUser,
  UserDoesNotExistError,
  UsersNotFoundError,
} from "../../domain";
import { Password } from "../../domain/value-objects/password.value-object";
import { UserPersistenceAdapter } from "../user-persistence.adapter";

export class MySqlUserRepository implements IUserRepository {
  private userPersistenceAdapter: UserPersistenceAdapter =
    new UserPersistenceAdapter();

  async getById(id: string): Promise<IUser> {
    const rows = await MysqlDataBase.query(
      `SELECT user_id, email, role_id, active, user_created, user_updated, created_at, updated_at, deleted_at FROM users WHERE user_id = ? and deleted_at is null`,
      [id]
    );
    if (isNil(rows[0])) {
      Logger.error(`mysql : getById : UserDoesNotExistError`);
      throw new UserDoesNotExistError();
    }

    return this.userPersistenceAdapter.toDomain(rows[0]) as IUser;
  }

  async getAll(): Promise<IUser[]> {
    const rows = await MysqlDataBase.query(`SELECT 
    user_id, email, role_id, active, user_created, user_updated, created_at, updated_at 
    FROM users where deleted_at is null`);
    if (rows.length === 0) {
      Logger.error(`mysql : getAll : UsersNotFoundError`);
      throw new UsersNotFoundError();
    }
    return this.userPersistenceAdapter.toDomainList(rows) as IUser[];
  }

  async create(user: IUser): Promise<void> {
    const userPersistence = this.userPersistenceAdapter.toPersistence(user);
    const passwordHash = await Password.genPasswordHash(
      userPersistence.password!
    );
    const result = await MysqlDataBase.update(
      "INSERT INTO users SET user_id = ?, email = ?, password = ?, role_id = ?",
      [
        userPersistence.user_id!.toString(),
        userPersistence.email.toString(),
        passwordHash!.toString(),
        userPersistence.role_id!.toString(),
      ]
    );
  }

  async update(user: IUser): Promise<void> {
    const userPersistence = this.userPersistenceAdapter.toPersistence(user);
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
    const userPersistence = this.userPersistenceAdapter.toPersistence(user);
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
    const userPersistence = this.userPersistenceAdapter.toPersistence(user);
    const uid = userPersistence.user_id!.toString();
    const password = userPersistence.password!.toString();
    const result = await MysqlDataBase.update(
      "UPDATE users SET password = ? WHERE user_id = ?",
      [password, uid]
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
      user_id, email, role_id, active
      FROM users WHERE email = ? and deleted_at is null`,
      [email]
    );
    if (isNil(rows[0])) {
      Logger.error(`mysql : findByEmail : UserDoesNotExistError`);
      throw new UserDoesNotExistError();
    }
    return this.userPersistenceAdapter.toDomain(rows[0]) as IUser;
  }

  async checkUserExistenceByEmail(email: string): Promise<boolean> {
    const user = await MysqlDataBase.query(
      `SELECT
      user_id, email, role_id, active
      FROM users WHERE email = ? and deleted_at is null`,
      [email]
    );

    return !!user.length;
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
