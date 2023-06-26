import express, { Application } from "express";
import cors from "cors";
import Helmet from "helmet";
import fs from "fs";
import https from "https";
import http from "http";
// Routes
import { router as userRoutes } from "./routes/user.routes";
import { router as partnerRoutes } from "./routes/partner.routes";
import { router as filesRoutes } from "./routes/files.routes";
import { router as feesRoutes } from "./routes/fees.routes";
import { router as productsRoutes } from "./routes/products.routes";

import { router as paymentsRoutes } from "./routes/payments.routes";
import { router as providersRoutes } from "./routes/providers.routes";
import { router as purchasesRoutes } from "./routes/purchases.routes";
import { router as salesRoutes } from "./routes/sales.routes";
import { router as transactionsRoutes } from "./routes/transactions.routes";
// Config
import setup from "../../config/app-config";
import Logger from "../utils/logger";
import {
  errorHandler,
  errorStatusHandler,
  notFoundHandler,
  unautorizedHandler,
} from "./error/handlers";
import { Server, Socket } from "socket.io";
import SocketServer from "./socket-server";
import { GetUserUseCase } from "../../modules/users/application";
import { MySqlUserRepository } from "../../modules/users/infrastructure/mysql-user.repository";

export class AppServer {
  public app: Application;
  public io: Server;
  public corsConfig!: { origin: string; credentials: boolean };
  private httpsOptions!: object | undefined;

  constructor() {
    this.app = express();
    this.io = new Server();
    this.init();
  }

  init() {
    this.config();
    this.middlewares();
    this.routes();
    this.run();
  }

  config() {
    this.corsConfig =
      process.env.NODE_ENV === "prod" ? setup.CORS.REMOTE : setup.CORS.LOCAL;
    this.app.set("port", process.env.PORT);
    const crypto = require("crypto");
    this.httpsOptions =
      process.env.NODE_ENV === "prod"
        ? {
            key: fs.readFileSync(setup.HTTPS_OPTIONS.KEY),
            cert: fs.readFileSync(setup.HTTPS_OPTIONS.CERT),
            secureOptions:
              crypto.constants.SSL_OP_NO_TLSv1 |
              crypto.constants.SSL_OP_NO_TLSv1_1,
          }
        : {};
  }

  middlewares() {
    this.app.use(Helmet());
    this.app.use(cors(this.corsConfig));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
  }

  routes(): void {
    this.app.use("/api/users", userRoutes);
    this.app.use("/api/partners", partnerRoutes);
    this.app.use("/api/files", filesRoutes);
    this.app.use("/api/fees", feesRoutes);
    this.app.use("/api/products", productsRoutes);
    this.app.use("/api/payments", paymentsRoutes);
    this.app.use("/api/providers", providersRoutes);
    this.app.use("/api/purchases", purchasesRoutes);
    this.app.use("/api/sales", salesRoutes);
    this.app.use("/api/transactions", transactionsRoutes);

    this.app.use(notFoundHandler);
    this.app.use(unautorizedHandler);
    this.app.use(errorStatusHandler);
    this.app.use(errorHandler);
  }

  run(): void {
    process.env.NODE_ENV === "prod" ? this.runProd() : this.runLocal();
  }

  private runLocal() {
    const port = this.app.get("port");
    const httpServer = http.createServer(this.app);
    const userRepository = new MySqlUserRepository();
    const getUserService = new GetUserUseCase(userRepository);
    const socketServer = new SocketServer(httpServer, getUserService);

    httpServer.listen(port, "0.0.0.0", () => {
      Logger.debug(`Server running on port ${port}`);
    });
  }

  private runProd() {
    const httpsServer = https.createServer(this.httpsOptions!, this.app);
    const userRepository = new MySqlUserRepository();
    const getUserService = new GetUserUseCase(userRepository);
    const socketServer = new SocketServer(httpsServer, getUserService);

    httpsServer.listen(this.app.get("port"), "0.0.0.0", () => {
      Logger.debug(`Server running on port ${this.app.get("port")}`);
    });
  }
}
