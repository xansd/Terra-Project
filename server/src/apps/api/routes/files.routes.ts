import { Router } from "express";
import { check } from "express-validator";
import { catchValidationErrors } from "../error/validate-fileds";
import authorize from "../middlewares/authorize";
import { MysqlFilesRepository } from "../../../modules/files/infrastructure/mysql-files.repository";
import { FilesCaseUses } from "../../../modules/files/application/files.use-case";
import { Role } from "../../../modules/users/domain";
import { FilesController } from "../controllers/files.controller";
import FileUploader from "../../../modules/files/infrastructure/aws-storage.repository";

const router = Router();

// Repositorio
const filesRepository = new MysqlFilesRepository();

// Casos de uso
const filesUseCase = new FilesCaseUses(filesRepository);

// Controlador
const filesController = new FilesController(filesUseCase);

// Uploader
const fileUploader = new FileUploader();

// GET BY ID
router.get(
  "/:id",
  authorize([Role.ADMIN, Role.USER]),
  [check("id", "El id es obligatorio").not().isEmpty(), catchValidationErrors],
  filesController.getById.bind(filesController)
);

// GET ALL FILES BY ENTITY_ID
router.get(
  "/all/:id",
  authorize([Role.ADMIN, Role.USER]),
  [check("id", "El id es obligatorio").not().isEmpty(), catchValidationErrors],
  filesController.getAll.bind(filesController)
);

// GET DOCUMENT TYPES
router.get(
  "/details/types",
  authorize([Role.ADMIN, Role.USER]),
  filesController.getTypes.bind(filesController)
);

// DOWNLOAD ALL FILES BY ENTITY_ID
router.get(
  "/downloadFiles/:id",
  authorize([Role.ADMIN, Role.USER]),
  [check("id", "El id es obligatorio").not().isEmpty(), catchValidationErrors],
  filesController.downloadAll.bind(filesController)
);

// DOWNLOAD FILE
router.get(
  "/downloadFile/:id",
  authorize([Role.ADMIN, Role.USER]),
  [check("id", "El id es obligatorio").not().isEmpty(), catchValidationErrors],
  filesController.downloadAll.bind(filesController)
);

// UPLOAD
router.post(
  "/",
  authorize([Role.ADMIN, Role.USER]),
  fileUploader.getSingleUploader("file"),
  filesController.upload.bind(filesController)
);

// DELETE
router.delete(
  "/:id",
  authorize([Role.ADMIN, Role.USER]),
  [check("id", "El id es obligatorio").not().isEmpty(), catchValidationErrors],
  filesController.delete.bind(filesController)
);

export { router };
