export default {
  REGEX: {
    EMAIL: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
    PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&_-])/,
  },
  VALIDATION: {
    PASSWORD_MIN: 10,
    PASSWORD_MAX: 24,
  },
  PAGE_ON_CONSTRUCTION: 'Esta página se encuantra en construcción',
};
