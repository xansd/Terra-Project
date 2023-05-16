import * as dotenv from "dotenv";
dotenv.config();

export default {
  APP_PORT: 8531,
  DEFAULT_USER_PASSWORD: process.env.DEFAULT_USER_PASSWORD,
  TOKEN_EXPIRES_IN: "12h",
  SALT: parseInt(process.env.SALT!),
  JWT_SECRET:
    "MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDkDXDfWtfwDotP",
  CORS: {
    LOCAL: {
      origin: "http://localhost:4200",
      credentials: true,
    },
    REMOTE: {
      origin: "https://erp.appges.com:8080",
      credentials: true,
    },
  },
  CORS_IO: {
    LOCAL: {
      origin: "http://localhost:4200",
      methods: ["GET", "POST"],
      allowedHeaders: ["Content-Type", "Authorization"],
    },
    REMOTE: {
      origin: "https://erp.appges.com:8080",
      methods: ["GET", "POST"],
      allowedHeaders: ["Content-Type", "Authorization"],
    },
  },
  HTTPS_OPTIONS: {
    KEY: "/etc/ssl/private/_.appges.com_private_key.key",
    CERT: "/etc/ssl/certs/appges.com_ssl_certificate.cer",
  },
};
