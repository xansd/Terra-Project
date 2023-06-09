import { Router } from "express";
import { check } from "express-validator";
import { catchValidationErrors } from "../error/validate-fileds";
import authorize from "../middlewares/authorize";
import { MySqlPartnerRepository } from "../../../modules/partners/infrastructure/mysql-partner.repository";
import { PartnerController } from "../controllers/partner.controller";
import { CreatePartnerUseCase } from "../../../modules/partners/application/use-cases/create-partner.use-case";
import { DeletePartnerUseCase } from "../../../modules/partners/application/use-cases/delete-partner.use-case";
import { GetPartnerUseCase } from "../../../modules/partners/application/use-cases/get-partners.use-case";
import { UpdatePartnerUseCase } from "../../../modules/partners/application/use-cases/update-partner.use-case";
import { Role } from "../../../modules/users/domain";
import { ToggleActivePartnerUseCase } from "../../../modules/partners/application/use-cases/toggle-active-partner.use-case";

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

// Controlador
const partnerController = new PartnerController(
  createPartnerUseCase,
  getPartnerUseCase,
  deletePartnerUseCase,
  toggleActivePartnerUserCase,
  updatePartnerUseCase
);

// GET BY ID
router.get(
  "/:id",
  authorize([Role.ADMIN, Role.USER]),
  [check("id", "El id es obligatorio").not().isEmpty(), catchValidationErrors],
  partnerController.getById.bind(partnerController)
);

// GET ALL
router.get(
  "/",
  authorize([Role.ADMIN, Role.USER]),
  partnerController.getAll.bind(partnerController)
);

// GET ALL ID, NUM, ACCESS, SURNAME, NAME
router.get(
  "/all/filtered",
  authorize([Role.ADMIN, Role.USER]),
  partnerController.getAllFiltered.bind(partnerController)
);

// GET TYPES
router.get(
  "/details/types",
  authorize([Role.ADMIN, Role.USER]),
  partnerController.getTypes.bind(partnerController)
);

// GET LAST NUMBER
router.get(
  "/details/number",
  authorize([Role.ADMIN, Role.USER]),
  partnerController.getLastNumber.bind(partnerController)
);

// CREATE
router.post(
  "/",
  authorize([Role.ADMIN, Role.USER]),
  partnerController.create.bind(partnerController)
);

// UPDATE
router.put(
  "/",
  authorize([Role.ADMIN, Role.USER]),
  partnerController.update.bind(partnerController)
);

// DELETE
router.delete(
  "/:id",
  authorize([Role.ADMIN, Role.USER]),
  [check("id", "El id es obligatorio").not().isEmpty(), catchValidationErrors],
  partnerController.delete.bind(partnerController)
);

// ACTIVATE
router.put(
  "/activate/:id",
  authorize([Role.ADMIN, Role.USER]),
  [check("id", "El id es obligatorio").not().isEmpty(), catchValidationErrors],
  partnerController.makeActive.bind(partnerController)
);

// BLOCK
router.put(
  "/block/:id",
  authorize([Role.ADMIN, Role.USER]),
  [check("id", "El id es obligatorio").not().isEmpty(), catchValidationErrors],
  partnerController.makeInactive.bind(partnerController)
);

// LEAVES
router.put(
  "/leaves/:id",
  authorize([Role.ADMIN, Role.USER]),
  [check("id", "El id es obligatorio").not().isEmpty(), catchValidationErrors],
  partnerController.partnerLeaves.bind(partnerController)
);

// UPDATE ACCESS CODE
router.put(
  "/access/:id",
  authorize([Role.ADMIN, Role.USER]),
  [check("id", "El id es obligatorio").not().isEmpty(), catchValidationErrors],
  partnerController.updateAccessCode.bind(partnerController)
);

// UPDATE PARTNER CASH
router.put(
  "/cash/:id",
  authorize([Role.ADMIN, Role.USER]),
  [check("id", "El id es obligatorio").not().isEmpty(), catchValidationErrors],
  partnerController.updatePartnerCash.bind(partnerController)
);

/*****************************DOCUMENTS********************************************/
// GET FEE
router.get(
  "/documents/fee",
  authorize([Role.ADMIN, Role.USER]),
  partnerController.getTypes.bind(partnerController)
);
// GET REGISTRATION FEE
router.get(
  "/documents/registration-fee",
  authorize([Role.ADMIN, Role.USER]),
  partnerController.getTypes.bind(partnerController)
);
// GET REGISTRATION
router.get(
  "/documents/registration",
  authorize([Role.ADMIN, Role.USER]),
  partnerController.getTypes.bind(partnerController)
);
// GET CONTRACT
router.get(
  "/documents/contract",
  authorize([Role.ADMIN, Role.USER]),
  partnerController.getTypes.bind(partnerController)
);

export { router };
