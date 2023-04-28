export default {
  APP_PORT: 8531,
  TOKEN_EXPIRES_IN: "8h",
  SALT: parseInt(process.env.SALT!),
  JWT_SECRET: process.env.JWT_SECRET,
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
  HTTPS_OPTIONS: {
    KEY: "/etc/ssl/private/_.appges.com_private_key.key",
    CERT: "/etc/ssl/certs/appges.com_ssl_certificate.cer",
  },
};
