import * as dotenv from "dotenv";
import { Server } from "./api/server";

dotenv.config();
new Server();
