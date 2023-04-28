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
      const [rows] = await MysqlDataBase.query(
        "SELECT * FROM users WHERE id = ?",
        [id]
      );
      if (Array.isArray(rows)) {
        return rows[0];
      }
      return null;
    } catch (error: unknown) {
      Logger.error(`mysql : user-repository : getById : ${error}`);
      throw new Error("Error MYSQL al buscar el usuario por ID");
    }
  }

  async getAll(): Promise<IUserDTO[] | null> {
    try {
      const [rows] = await MysqlDataBase.query("SELECT * FROM users");
      if (Array.isArray(rows)) {
        return rows.map((row) => row);
      }
      return null;
    } catch (error: unknown) {
      Logger.error(`mysql : user-repository : getAll : ${error}`);
      throw new Error("Error MYSQL al buscar todos los usuarios");
    }
  }

  async create(user: Entity<IUser>): Promise<IUserDTO | null> {
    const uid = user._id.value;
    console.log("uid", uid);
    const userPersistence = this.userPersistenceAdapter.toPersistence(user);
    try {
      const result = await MysqlDataBase.update(
        "INSERT INTO users SET user_id = ?, email = ?, password = ?, role_id = ?",
        [
          uid!,
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
    const uid = user._id.value;
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

  async delete(user: Entity<IUser>): Promise<IUserDTO | null> {
    const uid = user._id.value;
    const [result] = await MysqlDataBase.update(
      `UPDATE users SET
        deleted_at = CURRENT_TIMESTAMP,
        user_updated = ?
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

  async updatePassword(
    user: Entity<IUser>,
    password: string
  ): Promise<IUserDTO | null> {
    const uid = user._id.value;
    const [result] = await MysqlDataBase.update(
      "UPDATE users SET password = ? WHERE id = ?",
      [password, uid]
    );
    if (result.affectedRows > 0) {
      return this.userAdapter.toDTO(user);
    }
    return null;
  }
}
