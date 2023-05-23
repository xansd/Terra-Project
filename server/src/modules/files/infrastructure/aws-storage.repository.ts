import { S3Client } from "@aws-sdk/client-s3";
import multer from "multer";
import multerS3 from "multer-s3";
import CONFIG from "../../../config/app-config";
import { Request, Response } from "express";
import { InvalidFileExtensionError } from "../domain/files.exceptions";

const s3 = new S3Client({
  credentials: {
    accessKeyId: CONFIG.AWS_S3.S3_ACCESS_KEY_ID!,
    secretAccessKey: CONFIG.AWS_S3.S3_SECRET_ACCESS_KEY!,
  },
  region: "eu-west-3",
});

const storage = multerS3({
  s3,
  bucket: "asoterrabucket",
  metadata: (req: Request, file, cb) => {
    cb(null, { fieldName: file.fieldname });
  },
  key: (req: Request, file, cb) => {
    let folder;

    // Determinar la carpeta de destino en función del tipo de archivo
    if (req.body.policy === "private") {
      folder = "erpAppBucket";
    } else if (req.body.policy === "publico") {
      folder = "publicAppBucket";
    }
    // Crea el nombre del fichero
    const uniqueFileName =
      folder +
      "/" +
      file.originalname
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(/-+|_+/g, "_")
        .replace(/[^a-zA-Z0-9_ ]/g, "")
        .replace(/\p{Diacritic}/gu, "")
        .replace(/ +/g, "_") +
      "-" +
      Date.now();
    cb(null, uniqueFileName);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, //5MB
  },
  fileFilter: (req, file, cb) => {
    // Verificar la extensión permitida
    if (
      !file.originalname.match(
        /\.(jpg|jpeg|png|webp|odt|ods|doc|docx|xls|csv|pdf|txt|xlsx)$/i
      )
    ) {
      return cb(new InvalidFileExtensionError());
    }
    cb(null, true);
  },
});

export default upload;
