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
  REQUIRED_FILE_IMAGE_TYPES: ['jpg', 'jpeg', 'png', 'webp'],
  MAX_FILE_SIZE: 10 * 1024 * 1024,
  DEFAULT_IMAGE: '/assets/img/loading.gif',
  MIME_TYPES: {
    // Texto
    txt: 'text/plain',
    csv: 'text/csv',
    html: 'text/html',
    css: 'text/css',
    js: 'text/javascript',
    json: 'application/json',
    xml: 'application/xml',

    // Imágenes
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    bmp: 'image/bmp',
    webp: 'image/webp',
    svg: 'image/svg+xml',

    // Aplicaciones de ofimática
    doc: 'application/msword',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    xls: 'application/vnd.ms-excel',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ppt: 'application/vnd.ms-powerpoint',
    pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    odp: 'application/vnd.oasis.opendocument.presentation',
    ods: 'application/vnd.oasis.opendocument.spreadsheet',
    odt: 'application/vnd.oasis.opendocument.text',
    pdf: 'application/pdf',
  },
  SEVERITY: [
    {
      name: 'Leve',
      level: 1,
    },
    {
      name: 'Grave',
      level: 2,
    },
    {
      name: 'Muy grave',
      level: 3,
    },
  ],
};
