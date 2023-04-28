import * as dotenv from "dotenv";
import { Server } from "./server/server";

dotenv.config();
new Server();
