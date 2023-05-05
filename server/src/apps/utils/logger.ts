import winston from "winston";
import { ILogger } from "../../modules/shared/application/logger.interface";
import * as dotenv from "dotenv";
dotenv.config();

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const colors = {
  error: "red",
  warn: "yellow",
  info: "green",
  http: "magenta",
  debug: "blue",
};

winston.addColors(colors);
/** En modo dev guardamos todos los niveles de log. En modo prod guardamos a partir de info level */
const level = () => {
  const env = process.env.NODE_ENV || "dev";
  const isDevelopment = env === "dev";
  return isDevelopment ? "debug" : "info";
};

const formatDev = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `${info.timestamp} [${info.level}]: ${info.message}`
  )
);

const formatProd = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.printf(
    (info) => `${info.timestamp} [${info.level}] ${info.message}`
  )
);

const transports = [
  new winston.transports.Console(),
  new winston.transports.File({
    filename: __dirname + "/../../../logs/error.log",
    level: "error",
    maxsize: 10000000,
    maxFiles: 10,
  }),
  new winston.transports.File({
    filename: __dirname + "/../../../logs/logs.log",
    level: "info",
    maxsize: 10000000,
    maxFiles: 10,
  }),
];

const getFormat = () => {
  const isDevelopment = process.env.NODE_ENV;
  if (isDevelopment === "dev") {
    return formatDev;
  } else return formatProd;
};

const Logger: ILogger = winston.createLogger({
  level: level(),
  levels,
  format: getFormat(),
  transports,
});

export default Logger;
