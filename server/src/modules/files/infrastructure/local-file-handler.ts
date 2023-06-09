import fs from "fs";
import { Readable } from "stream";
import { DownloadError } from "../domain/files.exceptions";
import Logger from "../../../apps/utils/logger";
import path from "path";
import { ILocalFileHandler } from "../domain/file.repository";

export class LocalFileHandler implements ILocalFileHandler {
  async downloadFile(fileName: string): Promise<Buffer> {
    const documentsFolder = path.join(__dirname, "../../../../documents");
    const filePath = documentsFolder + "/" + fileName;
    try {
      const fileData = await fs.promises.readFile(filePath);
      return fileData;
    } catch (error) {
      Logger.error(`LocalFileHandler : downloadFile : DownloadError`);
      throw new DownloadError(fileName);
    }
  }

  async streamFile(localFilePath: string): Promise<Readable> {
    try {
      const fileStream = fs.createReadStream(localFilePath);
      return fileStream;
    } catch (error) {
      Logger.error(`LocalFileHandler : streamFile : DownloadError`);
      throw new DownloadError(localFilePath);
    }
  }
}

export default LocalFileHandler;
