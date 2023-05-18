import { Router } from "express";
import { check } from "express-validator";
import { catchValidationErrors } from "../error/validate-fileds";
import authorize from "../middlewares/authorize";
import { MySqlPartnerRepository } from "../../../modules/partners/infrastructure/mysql/mysql-partner.adapter";
import { PartnerController } from "../controllers/partner.controller";
import { CreatePartnerUseCase } from "../../../modules/partners/application/use-cases/create-partner.use-case";
import { DeletePartnerUseCase } from "../../../modules/partners/application/use-cases/delete-partner.use-case";
import { GetPartnerUseCase } from "../../../modules/partners/application/use-cases/get-partners.use-case";
import { UpdatePartnerUseCase } from "../../../modules/partners/application/use-cases/update-partner.use-case";
import { Role } from "../../../modules/users/domain";
import { ToggleActivePartnerUseCase } from "../../../modules/partners/application/use-cases/toggle-active-partner.use-case";
import { ManagePartnersDocumentationUseCase } from "../../../modules/partners/application/use-cases/manage-partners-documentd.use-case";

const router = Router();

// Repositorio
const userRepository = new MySqlPartnerRepository();

// Casos de uso
const createPartnerUseCase = new CreatePartnerUseCase(userRepository);
const getPartnerUseCase = new GetPartnerUseCase(userRepository);
const updatePartnerUseCase = new UpdatePartnerUseCase(userRepository);
const deletePartnerUseCase = new DeletePartnerUseCase(userRepository);
const toggleActivePartnerUserCase = new ToggleActivePartnerUseCase(
  userRepository
);
const managePartnerDocumentationUseCase =
  new ManagePartnersDocumentationUseCase(userRepository);

// Controlador
const partnerController = new PartnerController(
  createPartnerUseCase,
  getPartnerUseCase,
  deletePartnerUseCase,
  toggleActivePartnerUserCase,
  updatePartnerUseCase,
  managePartnerDocumentationUseCase
);

// GET BY ID
router.get(
  "/:id",
  authorize([Role.ADMIN, Role.USER]),
  [check("id", "El id es obligatorio").not().isEmpty()],
  partnerController.getById.bind(partnerController)
);

// GET ALL
router.get(
  "/",
  authorize([Role.ADMIN, Role.USER]),
  partnerController.getAll.bind(partnerController)
);

// CREATE
router.post(
  "/",
  authorize([Role.ADMIN, Role.USER]),
  [
    check("partner", "El partner es obligatorio").not().isEmpty(),
    catchValidationErrors,
  ],
  partnerController.update.bind(partnerController)
);

// UPDATE
router.put(
  "/:id",
  authorize([Role.ADMIN, Role.USER]),
  [
    check("id", "El id es obligatorio").not().isEmpty(),
    check("partner", "El partner es obligatorio").not().isEmpty(),
    catchValidationErrors,
  ],
  partnerController.update.bind(partnerController)
);

// DELETE
router.delete(
  "/:id",
  authorize([Role.ADMIN, Role.USER]),
  [check("id", "El id es obligatorio").not().isEmpty()],
  partnerController.delete.bind(partnerController)
);

// ACTIVATE
router.put(
  "/activate/:id",
  authorize([Role.ADMIN, Role.USER]),
  [check("id", "El id es obligatorio").not().isEmpty()],
  partnerController.makeActive.bind(partnerController)
);

// BLOCK
router.put(
  "/block/:id",
  authorize([Role.ADMIN, Role.USER]),
  [check("id", "El id es obligatorio").not().isEmpty()],
  partnerController.makeInactive.bind(partnerController)
);

// GET DOCUMENT
router.get(
  "/documents/:id",
  authorize([Role.ADMIN, Role.USER]),
  [check("id", "El id es obligatorio").not().isEmpty()],
  partnerController.getDocument.bind(partnerController)
);

// GET ALL DOCUMENTS
router.get(
  "/documents",
  authorize([Role.ADMIN, Role.USER]),
  partnerController.getAllDocuments.bind(partnerController)
);

// DELETE DOCUMENT
router.delete(
  "/documents/:id",
  authorize([Role.ADMIN, Role.USER]),
  [check("id", "El id es obligatorio").not().isEmpty()],
  partnerController.deleteDocument.bind(partnerController)
);

// UPLOAD DOCUMENT
router.post(
  "/documents/",
  authorize([Role.ADMIN, Role.USER]),
  [
    check("id", "El id es obligatorio").not().isEmpty(),
    check("file", "El fichero es obligatorio").not().isEmpty(),
    catchValidationErrors,
  ],
  partnerController.uploadDocument.bind(partnerController)
);

export { router };
