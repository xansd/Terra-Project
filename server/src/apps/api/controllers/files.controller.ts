import { FilesCaseUses } from "../../../modules/files/application/files.use-case";
import { Request, Response } from "express";
import {
  FileDoesNotExistError,
  InvalidFileExtensionError,
  NoRefererenceError,
} from "../../../modules/files/domain/files.exceptions";
import { NotFound, InternalServerError, BadRequest } from "../error/http-error";
import { MulterError } from "multer";

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

  async upload(request: Request, response: Response): Promise<void> {
    try {
      const result = await this.filesUseCases.uploadFile(request.body);
      response.json(result);
    } catch (error) {
      if (error instanceof NoRefererenceError) {
        response.send(BadRequest(error.message));
      } else if (error instanceof InvalidFileExtensionError) {
        response.send(BadRequest(error.message));
      } else if (
        error instanceof MulterError &&
        error.code === "LIMIT_FILE_SIZE"
      ) {
        response.send(
          BadRequest("El archivo excede el tamaño máximo permitido (5MB)")
        );
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
