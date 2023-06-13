import fs from "fs";
import { Readable } from "stream";
import { DownloadError } from "../domain/files.exceptions";
import Logger from "../../../apps/utils/logger";
import path from "path";
import { ILocalFileHandler } from "../domain/file.repository";

export class LocalFileHandler {
  async downloadFile(fileName: string): Promise<Buffer> {
    try {
      const documentsFolder = path.join(__dirname, "../../../../../documents");
      const filePath = path.join(documentsFolder, fileName);
      const fileData = await fs.promises.readFile(filePath);
      return fileData;
    } catch (error) {
      Logger.error(`LocalFileHandler : downloadFile : DownloadError`);
      throw new DownloadError(fileName);
    }
  }

  async streamFile(fileName: string): Promise<Readable> {
    try {
      const documentsFolder = path.join(__dirname, "../../../../../documents");
      const fileStream = fs.createReadStream(documentsFolder + "/" + fileName);
      return fileStream;
    } catch (error) {
      Logger.error(`LocalFileHandler : streamFile : DownloadError`);
      throw new DownloadError(fileName);
    }
  }
}

export default LocalFileHandler;
