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
import { PartnerDocumentsService } from "../../../modules/partners/application/use-cases/partner-documents.service";
import { ODTGenerator } from "../../../modules/partners/infrastructure/odt-generator";
import LocalFileHandler from "../../../modules/files/infrastructure/local-file-handler";
import { MySqlPaymentsRepository } from "../../../modules/payments/infrastructure/mysql-payments.repository";
import { MySqlTransactionsRepository } from "../../../modules/transactions/infrastructure/mysql-transactions.repository";
import { PartnerCashService } from "../../../modules/partners/application/services/partner-cash.service";
import { MySqlPurchasesRepository } from "../../../modules/purchases/infrastructure/mysql-purchases.repository";
import { MysqlFeesRepository } from "../../../modules/fees/infrastructure/mysql-fees.repository";

const router = Router();

const odtGenerator = new ODTGenerator();
const localFileHandler = new LocalFileHandler();

// Repositorio
const partnerRepository = new MySqlPartnerRepository();
const transactionsRepository = new MySqlTransactionsRepository();
const paymentsRepository = new MySqlPaymentsRepository();
const purchasesRepository = new MySqlPurchasesRepository();
const feesRepository = new MysqlFeesRepository();

// Casos de uso
const createPartnerUseCase = new CreatePartnerUseCase(partnerRepository);
const getPartnerUseCase = new GetPartnerUseCase(partnerRepository);
const cashService = new PartnerCashService();
const updatePartnerUseCase = new UpdatePartnerUseCase(
  partnerRepository,
  transactionsRepository,
  paymentsRepository,
  purchasesRepository,
  cashService,
  feesRepository
);
const deletePartnerUseCase = new DeletePartnerUseCase(partnerRepository);
const toggleActivePartnerUserCase = new ToggleActivePartnerUseCase(
  partnerRepository
);
const documentService = new PartnerDocumentsService(
  odtGenerator,
  localFileHandler
);

// Controlador
const partnerController = new PartnerController(
  createPartnerUseCase,
  getPartnerUseCase,
  deletePartnerUseCase,
  toggleActivePartnerUserCase,
  updatePartnerUseCase,
  documentService
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
  "/cash",
  authorize([Role.ADMIN, Role.USER]),
  partnerController.updatePartnerCash.bind(partnerController)
);

/*****************************DOCUMENTS********************************************/
// GET DOCUMENT
router.post(
  "/documents",
  authorize([Role.ADMIN, Role.USER]),
  partnerController.getPartnerDocument.bind(partnerController)
);

/*****************************SANCTIONS********************************************/
// CREATE SANCTION
router.post(
  "/sanctions",
  authorize([Role.ADMIN, Role.USER]),
  partnerController.createSanction.bind(partnerController)
);

// DELETE SANCTION
router.delete(
  "/sanctions/:id",
  authorize([Role.ADMIN, Role.USER]),
  [check("id", "El id es obligatorio").not().isEmpty(), catchValidationErrors],
  partnerController.deleteSanction.bind(partnerController)
);

export { router };
