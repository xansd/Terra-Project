import express, { Application } from "express";
import cors from "cors";
import Helmet from "helmet";
import fs from "fs";
import https from "https";
// Routes
import { router as userRoutes } from "./routes/user.routes";
// Config
import setup from "../../config/app-config";
import Logger from "../../modules/shared/infraestructure/logger";

export class Server {
  public app: Application;
  public corsConfig!: { origin: string; credentials: boolean };
  private httpsOptions!: object | undefined;

  constructor() {
    this.app = express();
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
  }

  run(): void {
    process.env.NODE_ENV === "prod" ? this.runProd() : this.runLocal();
  }

  private runLocal() {
    const port = this.app.get("port");
    this.app.listen(port, "0.0.0.0", () => {
      Logger.debug(`Server running on port ${port}`);
    });
  }

  private runProd() {
    const server = https.createServer(this.httpsOptions!, this.app);
    server.listen(this.app.get("port"), "0.0.0.0", () => {
      Logger.debug(`Server running on port ${this.app.get("port")}`);
    });
  }
}
