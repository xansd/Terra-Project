import { FilesCaseUses } from "../../../modules/files/application/files.use-case";
import { Request, Response } from "express";
import {
  FileDoesNotExistError,
  InvalidFileExtensionError,
  NoRefererenceError,
} from "../../../modules/files/domain/files.exceptions";
import {
  NotFound,
  InternalServerError,
  BadRequest,
  _MulterError,
} from "../error/http-error";
import { MulterError } from "multer";
import AWS from "aws-sdk";
import SETUP from "../../../config/app-config";

export class FilesController {
  constructor(private filesUseCases: FilesCaseUses) {}

  async getById(request: Request, response: Response): Promise<void> {
    const { id } = request.params;
    try {
      const file = await this.filesUseCases.getFile(id);
      response.json(file);
    } catch (error) {
      if (error instanceof FileDoesNotExistError) {
        response.send(NotFound(error.message));
      } else {
        response.send(InternalServerError(error));
      }
    }
  }

  async getAll(request: Request, response: Response): Promise<void> {
    try {
      const { id } = request.params;
      const files = await this.filesUseCases.getFiles(id);
      response.json(files);
    } catch (error: any) {
      if (error instanceof FileDoesNotExistError) {
        response.send(NotFound(error.message));
      } else {
        response.send(InternalServerError(error));
      }
    }
  }

  async downloadAll(request: Request, response: Response): Promise<void> {
    try {
      const { id } = request.params;
      const files = await this.filesUseCases.downloadFiles(id);
      response.json(files);
    } catch (error: any) {
      if (error instanceof FileDoesNotExistError) {
        response.send(NotFound(error.message));
      } else {
        response.send(InternalServerError(error));
      }
    }
  }

  async upload(request: Request, response: Response): Promise<void> {
    try {
      const result = await this.filesUseCases.uploadFile(request.body);
      response.json(result);
    } catch (error) {
      if (error instanceof NoRefererenceError) {
        response.send(BadRequest(error.message));
      } else if (error instanceof InvalidFileExtensionError) {
        response.send(BadRequest(error.message));
      } else if (error instanceof MulterError) {
        response.send(_MulterError("Error al subir el archivo"));
      } else {
        response.send(InternalServerError(error));
      }
    }
  }

  async delete(request: Request, response: Response): Promise<void> {
    const { id } = request.params;
    try {
      const result = await this.filesUseCases.deleteFile(id);
      response.send(result);
    } catch (error) {
      if (error instanceof FileDoesNotExistError) {
        response.send(NotFound(error.message));
      } else {
        response.send(InternalServerError(error));
      }
    }
  }
}

// async downloadFiles(request: Request, response: Response): Promise<void> {
//   const key =
//     "publicAppBucket/flag_of_the_peoples_republic_of_chinasvg_1684968104699.png";
//   AWS.config.update(SETUP.AWS_S3.CONFIGS3);
//   let s3 = new AWS.S3();
//   let options = {
//     Bucket: SETUP.AWS_S3.BUCKET,
//     Key: key,
//   };
//   response.attachment(key);
//   var fileStream = s3.getObject(options).createReadStream();
//   fileStream.pipe(response);
// }
