import { IUser } from "../../domain";
import { ActiveUserRepository } from "../../infraestructure/active-user.repository";
import { GetUserUseCase } from "./get-user.use-case";

export interface IUserTrackingUseCase {
  connectUser(id: string): Promise<void>;
  disconnectuser(id: string): void;
  getActiveUsers(): IUser[];
}
export class UserTrackingUseCase implements IUserTrackingUseCase {
  constructor(
    private readonly activeUserRepository: ActiveUserRepository,
    private readonly getUserUseCase: GetUserUseCase
  ) {}

  async connectUser(id: string): Promise<void> {
    const user = await this.getUserUseCase.getUser(id);
    this.activeUserRepository.addUser(user);
  }
  disconnectuser(id: string): void {
    this.activeUserRepository.removeUser(id);
  }
  getActiveUsers(): IUser[] {
    throw new Error("Method not implemented.");
  }
}
