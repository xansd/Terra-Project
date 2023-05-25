import CONFIG from "../../../config/app-config";

export enum FilePolicy {
  PRIVATE = "private",
  PUBLIC = "public",
}
export class FileService {
  static REQUIRED_FILE_TYPES = CONFIG.REQUIRED_FILE_TYPES;
  static MAX_FILE_SIZE = CONFIG.MAX_FILE_SIZE;
  constructor() {}

  static validateFileExtension(fileName: string) {
    const ext = fileName.substring(fileName.lastIndexOf(".") + 1);
    if (FileService.REQUIRED_FILE_TYPES.indexOf(ext) === -1) return false;
    return true;
  }

  static validateFileSize(fileSize: number): boolean {
    if (
      FileService.MAX_FILE_SIZE === 0 ||
      fileSize <= FileService.MAX_FILE_SIZE
    )
      return true;
    return false;
  }

  static createFileName(originaFileName: string, policy: string) {
    const folder =
      policy === FilePolicy.PRIVATE ? "erpAppBucket" : "publicAppBucket";

    const filenameParts = originaFileName.split(".");
    const extension = filenameParts.pop();
    const filenameWithoutExtension = filenameParts.join("");

    return `${folder}/${FileService.normalize(
      filenameWithoutExtension
    )}_${Date.now()}.${extension}`;
  }

  private static normalize(value: string): string {
    return value
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/-+|_+/g, "_")
      .replace(/[^a-zA-Z0-9_ ]/g, "")
      .replace(/\p{Diacritic}/gu, "")
      .replace(/ +/g, "_");
  }
}
