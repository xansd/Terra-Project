import * as dotenv from "dotenv";
import { AppServer } from "./api/server";

dotenv.config();
new AppServer();
