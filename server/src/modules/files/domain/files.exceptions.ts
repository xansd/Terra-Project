export class FileDoesNotExistError extends Error {
  constructor() {
    super(`No hay ficheros`);
    this.name = "FileDoesNotExistError";
  }
}

export class NoRefererenceError extends Error {
  constructor() {
    super(`No se ha proporcionado una referencia para el documento`);
    this.name = "NoRefererenceError";
  }
}

export class InvalidFileExtensionError extends Error {
  constructor(filename: string) {
    super(`Extensión inválida para el fichero: ${filename} `);
    this.name = "InvalidFileExtensionError";
  }
}

export class InvalidFileSizeError extends Error {
  constructor(filename: string) {
    super(`No se permiten tamaños superiores a 5MB: ${filename}`);
    this.name = "InvalidFileSizeError";
  }
}

export class DownloadError extends Error {
  constructor(key: string) {
    super(`Error al descargar el archivo ${key}`);
    this.name = "DownloadError";
  }
}

export class UploadError extends Error {
  constructor(key: string) {
    super(`Error al subir el archivo ${key}`);
    this.name = "UploadError";
  }
}

export class InvalidFileBodyError extends Error {
  constructor() {
    super(`Invalid file body`);
    this.name = "InvalidFileBodyError";
  }
}

export class DeletingFileError extends Error {
  constructor() {
    super(`Error al borrar archivo`);
    this.name = "DeletingFileError";
  }
}
