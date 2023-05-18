import * as dotenv from "dotenv";
import { Server, Socket } from "socket.io";
import Logger from "../utils/logger";
import SETUP from "../../config/app-config";
import { GetUserUseCase } from "../../modules/users/application";
import { IUserDTO } from "../../modules/users/application/user.dto";
import { UserMapper } from "../../modules/users/application/user-dto.mapper";

dotenv.config();

class SocketServer {
  userMapper = new UserMapper();
  io: Server;
  activeUsers: IUserDTO[] = [];

  constructor(
    httpServer: any,
    private readonly getUserService: GetUserUseCase
  ) {
    this.io = new Server(httpServer, {
      cors:
        process.env.NODE_ENV === "prod"
          ? SETUP.CORS_IO.REMOTE
          : SETUP.CORS_IO.LOCAL,
    });

    this.setupEventHandlers();
  }

  private setupEventHandlers() {
    // Connected
    this.io.on("connection", (socket: Socket) => {
      Logger.debug(`Socket connected: ${socket.id}`);

      socket.on("registerActiveUser", async (userId: string) => {
        try {
          // Verify if user is already registered
          const existingUser = this.activeUsers.find(
            (user) => user.user_id === userId
          );
          // If user is already registered do nothing
          if (existingUser) {
            Logger.debug(`socket-io : User already registered: ${userId}`);
            return;
          }

          // Create user and push to active users list
          // TODO: Handle error uid not found
          const user = await this.getUserService.getUser(userId);
          this.activeUsers.push(this.userMapper.toDTO(user));
          Logger.debug(`socket-io : User registerd: ${userId}`);
        } catch (error) {
          console.log(error);
          Logger.error("socket-io : registerActiveUser");
        }
      });

      // On logout
      socket.on("unRegisterActiveUser", (userId: string) => {
        this.activeUsers = this.activeUsers.filter(
          (user) => user.user_id !== userId
        );
        Logger.debug(`socket-io : User unregistered: ${socket.id}`);
      });

      // Get active users
      socket.on("getActiveUsers", () => {
        socket.emit("activeUsersList", this.activeUsers);
      });

      // Kick user
      socket.on("logoutActiveUser", (userId: string) => {
        socket.emit("removeToken", userId);
        this.activeUsers = this.activeUsers.filter(
          (user) => user.user_id !== userId
        );
        Logger.debug(`socket-io : Logout user ${userId}`);
      });

      // Disconnected (app closed)
      socket.on("disconnect", () => {
        this.activeUsers = this.activeUsers.filter(
          (user) => user.user_id !== socket.id
        );

        Logger.debug(`socket-io: User disconnected: ${socket.id}`);
      });
    });
  }
}

export default SocketServer;

// TODO: Create USE CASES AND DO IMPLEMENTATION TO ACTIVE-USERS.REPOSITURY
