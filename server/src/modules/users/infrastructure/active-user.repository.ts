import { IUser } from "../domain";
import { UserID } from "../domain/value-objects/user-id.value-object";

export class ActiveUserRepository {
  activeUsers: IUser[] = [];

  addUser(user: IUser) {
    this.activeUsers.push(user);
  }

  removeUser(id: string) {
    const uid = UserID.create(id);
    this.activeUsers = this.activeUsers.filter((u) => u.user_id !== uid);
  }

  getActiveUsers(): IUser[] {
    return this.activeUsers;
  }
}
