import * as dotenv from "dotenv";
import { Server, Socket } from "socket.io";
import Logger from "../utils/logger";
import setup from "../../config/app-config";
import { GetUserUseCase } from "../../modules/users/application";
import { IUserDTO } from "../../modules/users/application/user.dto";
import { UserMapper } from "../../modules/users/application/user-dto.mapper";

dotenv.config();
const SETUP = setup;

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
          ? setup.CORS_IO.REMOTE
          : setup.CORS_IO.LOCAL,
    });

    this.setupEventHandlers();
  }

  private setupEventHandlers() {
    this.io.on("connection", (socket: Socket) => {
      Logger.debug(`Socket connected: ${socket.id}`);

      socket.on("registerActiveUser", async (userId: string) => {
        try {
          const user = await this.getUserService.getUser(userId);
          this.activeUsers.push(this.userMapper.toDTO(user));
          Logger.debug(`socket-io : User registerd: ${userId}`);
        } catch (error) {
          console.log(error);
          Logger.error("socket-io : registerActiveUser");
        }
      });

      socket.on("unRegisterActiveUser", (userId: string) => {
        this.activeUsers = this.activeUsers.filter(
          (user) => user.user_id !== userId
        );
        Logger.debug(`socket-io : User unregistered: ${socket.id}`);
      });

      socket.on("getActiveUsers", () => {
        socket.emit("activeUsersList", this.activeUsers);
      });

      socket.on("logoutActiveUser", (userId: string) => {
        socket.emit("removeToken", userId);
        this.activeUsers = this.activeUsers.filter(
          (user) => user.user_id !== userId
        );
        Logger.debug(`socket-io : Logout user ${userId}`);
      });

      // Evento para detectar desconexión
      socket.on("disconnect", () => {
        // Remover usuario activo al desconectar
        this.activeUsers = this.activeUsers.filter(
          (user) => user.user_id !== socket.id
        );

        Logger.debug(`socket-io: User disconnected: ${socket.id}`);
      });
    });
  }
}

export default SocketServer;
