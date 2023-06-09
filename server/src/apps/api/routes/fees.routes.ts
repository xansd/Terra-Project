import { Router } from "express";
import { MysqlFeesRepository } from "../../../modules/fees/infrastructure/mysql-fees.repository";
import { FeesUseCases } from "../../../modules/fees/application/use-cases/fees.use-cases";
import { FeesController } from "../controllers/fees.controllers";
import authorize from "../middlewares/authorize";
import { Role } from "../../../modules/users/domain";
import { check } from "express-validator";
import { catchValidationErrors } from "../error/validate-fileds";
import { MySqlTransactionsRepository } from "../../../modules/transactions/infrastructure/mysql-transactions.repository";
import { MySqlPaymentsRepository } from "../../../modules/payments/infrastructure/mysql-payments.repository";
import { MySqlPurchasesRepository } from "../../../modules/purchases/infrastructure/mysql-purchases.repository";
import { MySqlPartnerRepository } from "../../../modules/partners/infrastructure/mysql-partner.repository";

const router = Router();
const feesRepository = new MysqlFeesRepository();
const transactionsRepository = new MySqlTransactionsRepository();
const paymentsRepository = new MySqlPaymentsRepository();
const purchasesRepositrory = new MySqlPurchasesRepository();
const partnerRepository = new MySqlPartnerRepository();
const feesUseCases = new FeesUseCases(
  feesRepository,
  transactionsRepository,
  paymentsRepository,
  purchasesRepositrory,
  partnerRepository
);
const feesController = new FeesController(feesUseCases);

// GET BY ID
router.get(
  "/:id",
  authorize([Role.ADMIN, Role.USER]),
  [check("id", "El id es obligatorio").not().isEmpty(), catchValidationErrors],
  feesController.getById.bind(feesController)
);

// GET ALL
router.get(
  "/",
  authorize([Role.ADMIN, Role.USER]),
  feesController.getAll.bind(feesController)
);
// GET FEES TYPES
router.get(
  "/details/types",
  authorize([Role.ADMIN, Role.USER]),
  feesController.getTypes.bind(feesController)
);
// CREATE
router.post(
  "/",
  authorize([Role.ADMIN, Role.USER]),
  feesController.create.bind(feesController)
);

// UPDATE
router.put(
  "/",
  authorize([Role.ADMIN, Role.USER]),
  feesController.update.bind(feesController)
);

// PAY
router.put(
  "/payFee",
  authorize([Role.ADMIN, Role.USER]),
  feesController.payFee.bind(feesController)
);

// DELETE
router.delete(
  "/:id",
  authorize([Role.ADMIN, Role.USER]),
  [check("id", "El id es obligatorio").not().isEmpty(), catchValidationErrors],
  feesController.delete.bind(feesController)
);

export { router };
