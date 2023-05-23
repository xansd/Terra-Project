import { Router } from "express";
import { check } from "express-validator";
import { catchValidationErrors } from "../error/validate-fileds";
import authorize from "../middlewares/authorize";
import { MysqlFilesRepository } from "../../../modules/files/infrastructure/mysql-files.repository";
import { FilesCaseUses } from "../../../modules/files/application/files.use-case";
import { Role } from "../../../modules/users/domain";
import { FilesController } from "../controllers/files.controller";
import upload from "../../../modules/files/infrastructure/aws-storage.repository";

const router = Router();

// Repositorio
const filesRepository = new MysqlFilesRepository();

// Casos de uso
const filesUseCase = new FilesCaseUses(filesRepository);

// Controlador
const filesController = new FilesController(filesUseCase);

// GET BY ID
router.get(
  "/:id",
  authorize([Role.ADMIN, Role.USER]),
  [check("id", "El id es obligatorio").not().isEmpty(), catchValidationErrors],
  filesController.getById.bind(filesController)
);

// GET ALL
router.get(
  "/",
  authorize([Role.ADMIN, Role.USER]),
  [check("id", "El id es obligatorio").not().isEmpty(), catchValidationErrors],
  filesController.getAll.bind(filesController)
);

// UPLOAD
router.post(
  "/",
  authorize([Role.ADMIN, Role.USER]),
  upload.single("file"),
  filesController.upload.bind(filesController)
);

// DELETE
router.delete(
  "/:id",
  authorize([Role.ADMIN, Role.USER]),
  [
    check("fileId", "El id es obligatorio").not().isEmpty(),
    catchValidationErrors,
  ],
  filesController.delete.bind(filesController)
);

export { router };
