export class FileDoesNotExistError extends Error {
  constructor(filename: string) {
    super(`File ${filename} does not exist`);
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
  constructor() {
    super(
      `Extensiones permitidas: jpg|jpeg|png|webp|odt|ods|doc|docx|xls|csv|pdf|txt|xlsx`
    );
    this.name = "DuplicatedFileError";
  }
}

export class InvalidFileSizeError extends Error {
  constructor(filename: string) {
    super(`No se permiten tamaños superiores a 5MB`);
    this.name = "DuplicatedFileError";
  }
}
