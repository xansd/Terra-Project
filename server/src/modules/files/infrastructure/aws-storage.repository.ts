import SETUP from "../../../config/app-config";
import {
  S3Client,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import multer from "multer";
import multerS3 from "multer-s3";
import { NextFunction, Request, Response } from "express";
import {
  DeletingFileError,
  DownloadError,
  InvalidFileBodyError,
  InvalidFileExtensionError,
} from "../domain/files.exceptions";
import { FileService } from "../application/file.service";
import { InvalidFileSizeError } from "../domain/files.exceptions";
import { BadRequest, NotFound } from "../../../apps/api/error/http-error";
import { FileDoesNotExistError } from "../domain/files.exceptions";
import { Readable } from "nodemailer/lib/xoauth2";
import Logger from "../../../apps/utils/logger";

class FileUploader {
  private s3: S3Client;
  private confS3 = SETUP.AWS_S3.CONFIGS3;
  private storage: multer.StorageEngine;
  private upload: multer.Multer;
  static multerFile: Express.Multer.File | any;

  constructor() {
    this.s3 = new S3Client(this.confS3);

    this.storage = multerS3({
      s3: this.s3,
      bucket: SETUP.AWS_S3.BUCKET,
      metadata: (req: Request, file, cb) => {
        cb(null, { fieldName: file.fieldname, policy: req.body.policy });
      },
      key: (req: Request, file, cb) => {
        const uniqueFileName = FileService.createFileName(
          file.originalname,
          req.body.policy
        );
        req.body.key = uniqueFileName;
        cb(null, uniqueFileName);
      },
    });

    this.upload = multer({
      storage: this.storage,
    });
  }

  public getSingleUploader(fieldName: string) {
    const uploadMiddleware = this.upload.single(fieldName);

    const uploadValidator = (
      req: Request,
      res: Response,
      next: NextFunction
    ) => {
      // Validaciones
      try {
        const file = req.file;
        if (!file) {
          throw new FileDoesNotExistError();
        }
        FileUploader.multerFile = file;
        const isExtensionValid = FileService.validateFileExtension(
          FileUploader.multerFile.originalname
        );
        if (!isExtensionValid)
          throw new InvalidFileExtensionError(
            FileUploader.multerFile.originalname
          );
        const isSizeValid = FileService.validateFileSize(
          FileUploader.multerFile.size
        );
        if (!isSizeValid)
          throw new InvalidFileSizeError(FileUploader.multerFile.originalname);
      } catch (error) {
        if (
          error instanceof InvalidFileSizeError ||
          error instanceof InvalidFileSizeError
        ) {
          res.send(BadRequest(error.message));
        }
        if (error instanceof FileDoesNotExistError) {
          res.send(NotFound(error.message));
        }
      }

      // Si la validación es exitosa, puedes llamar a 'next()' para continuar con la solicitud
      next();
    };

    return [uploadMiddleware, uploadValidator];
  }

  getDocumentKey(): string {
    return `${FileUploader.multerFile.key}`;
    //https://${SETUP.AWS_S3.BUCKET}.s3.amazonaws.com//${FileUploader.multerFile.key}
  }

  async downloadFile(key: string): Promise<Buffer> {
    const getObjectParams = {
      Bucket: SETUP.AWS_S3.BUCKET,
      Key: key,
    };

    try {
      const { Body } = await this.s3.send(
        new GetObjectCommand(getObjectParams)
      );

      if (Body instanceof Readable) {
        const chunks: Uint8Array[] = [];
        for await (const chunk of Body) {
          chunks.push(chunk);
        }
        const fileData: Buffer = Buffer.concat(chunks);
        return fileData;
      } else {
        Logger.error(`downloadFile : InvalidFileBodyError : ${key}`);
        throw new InvalidFileBodyError();
      }
    } catch (error) {
      // Handle the error if it occurs
      Logger.error(`downloadFile : DownloadError : ${key}`);
      throw new DownloadError(key);
    }
  }

  async deleteFile(key: string): Promise<void> {
    const deleteParams = {
      Bucket: SETUP.AWS_S3.BUCKET,
      Key: key,
    };

    try {
      await this.s3.send(new DeleteObjectCommand(deleteParams));
    } catch (error) {
      Logger.error(`deleteFile : DeletingFileError : ${key}`);
      throw new DeletingFileError();
    }
  }
}

export default FileUploader;
