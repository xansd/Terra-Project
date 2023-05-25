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
  REQUIRED_FILE_TYPES: [
    'jpg',
    'jpeg',
    'png',
    'webp',
    'odt',
    'ods',
    'doc',
    'docx',
    'xls',
    'csv',
    'pdf',
    'txt',
    'xlsx',
  ],
  MAX_FILE_SIZE: 10 * 1024 * 1024,
  DEFAULT_IMAGE: '/assets/images/loading.gif',
};
