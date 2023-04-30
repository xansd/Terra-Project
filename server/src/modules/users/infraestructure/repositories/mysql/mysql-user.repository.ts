import { Entity } from "../../../../shared/domain";
import { MysqlDataBase } from "../../../../shared/infraestructure/database/mysql";
import Logger from "../../../../shared/utils/logger";
import { IUserDTO } from "../../../application";
import { IUserRepository, IUser } from "../../../domain";
import { UserPersistenceAdapter } from "../../adapters/user-persistence.adapter";
import { UserAdapter } from "../../../application/adapters/user.adapter";
export class MySqlUserRepository implements IUserRepository {
  private userPersistenceAdapter: UserPersistenceAdapter =
    new UserPersistenceAdapter();
  private userAdapter: UserAdapter = new UserAdapter();

  async getById(id: string): Promise<IUserDTO | null> {
    try {
      const rows = await MysqlDataBase.query(
        "SELECT * FROM users WHERE user_id = ?",
        [id]
      );
      if (rows.length > 0) {
        console.log("rows", rows);
        return rows as unknown as IUserDTO;
      }
      return null;
    } catch (error: unknown) {
      Logger.error(`mysql : user-repository : getById : ${error}`);
      throw new Error("Error MYSQL al buscar el usuario por ID");
    }
  }

  async getAll(): Promise<IUserDTO[] | null> {
    try {
      const rows = await MysqlDataBase.query("SELECT * FROM users");
      if (rows.length > 0) {
        return rows as unknown as IUserDTO[];
      }
      return null;
    } catch (error: unknown) {
      Logger.error(`mysql : user-repository : getAll : ${error}`);
      throw new Error("Error MYSQL al buscar todos los usuarios");
    }
  }

  async create(user: Entity<IUser>): Promise<IUserDTO | null> {
    const userPersistence = this.userPersistenceAdapter.toPersistence(user);
    try {
      const result = await MysqlDataBase.update(
        "INSERT INTO users SET user_id = ?, email = ?, password = ?, role_id = ?",
        [
          userPersistence.user_id!.toString(),
          userPersistence.email.toString(),
          userPersistence.password!.toString(),
          userPersistence.role_id!.toString(),
        ]
      );
      if (result.affectedRows > 0) {
        return this.userAdapter.toDTO(user);
      }
      return null;
    } catch (error: unknown) {
      Logger.error(`mysql : user-repository : create : ${error}`);
      throw new Error("Error MYSQL al crear el usuario");
    }
  }

  async update(user: Entity<IUser>): Promise<IUserDTO | null> {
    const userPersistence = this.userPersistenceAdapter.toPersistence(user);
    const uid = userPersistence.user_id!.toString();
    try {
      const [result]: any = await MysqlDataBase.update(
        "UPDATE users SET email = ?, role = ? WHERE id = ?",
        [user.props.email.toString(), user.props.role.toString(), uid]
      );
      if (result.affectedRows > 0) {
        return this.userAdapter.toDTO(user);
      }
      return null;
    } catch (error: unknown) {
      Logger.error(`mysql : user-repository : update : ${error}`);
      throw new Error("Error MYSQL al actualizar el usuario");
    }
  }

  async updatePassword(user: Entity<IUser>): Promise<IUserDTO | null> {
    const userPersistence = this.userPersistenceAdapter.toPersistence(user);
    const uid = userPersistence.user_id!.toString();
    const password = userPersistence.password!.toString();
    const [result] = await MysqlDataBase.update(
      "UPDATE users SET password = ? WHERE user_id = ?",
      [password, uid]
    );
    if (result.affectedRows > 0) {
      return this.userAdapter.toDTO(user);
    }
    return null;
  }

  async delete(user: Entity<IUser>): Promise<IUserDTO | null> {
    const userPersistence = this.userPersistenceAdapter.toPersistence(user);
    const uid = userPersistence.user_id!.toString();
    const [result] = await MysqlDataBase.update(
      `DELETE FROM users
        WHERE id_user = ?`,
      [uid]
    );
    if (result.affectedRows > 0) {
      return this.userAdapter.toDTO(user);
    }
    return null;
  }

  async findByEmail(email: string): Promise<IUserDTO | null> {
    const [rows] = await MysqlDataBase.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    if (rows) {
      return rows as IUserDTO;
    }
    return null;
  }

  activateUser(user: Entity<IUser>): Promise<IUserDTO | null> {
    throw new Error("Method not implemented.");
  }
  blockUser(user: Entity<IUser>): Promise<IUserDTO | null> {
    throw new Error("Method not implemented.");
  }
}
