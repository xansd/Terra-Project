import { Router } from "express";
import { MySqlPaymentsRepository } from "../../../modules/payments/infrastructure/mysql-payments.repository";
import { GetPayments } from "../../../modules/payments/application/use-cases/get-payments.use-cases";
import { UpdatePayments } from "../../../modules/payments/application/use-cases/update-payments.use-case";
import { PaymentsController } from "../controllers/payments.controller";
import { check } from "express-validator";
import { Role } from "../../../modules/users/domain";
import { catchValidationErrors } from "../error/validate-fileds";
import authorize from "../middlewares/authorize";
import { MySqlTransactionsRepository } from "../../../modules/transactions/infrastructure/mysql-transactions.repository";
import { MySqlPurchasesRepository } from "../../../modules/purchases/infrastructure/mysql-purchases.repository";
import { MysqlFeesRepository } from "../../../modules/fees/infrastructure/mysql-fees.repository";

const router = Router();

// Repositorio
const paymentsRepository = new MySqlPaymentsRepository();
const transactionsRepository = new MySqlTransactionsRepository();
const purchasesRepository = new MySqlPurchasesRepository();
const feesRepository = new MysqlFeesRepository();

// Casos de uso
const getPaymentsUseCase = new GetPayments(paymentsRepository);
const updatePaymentsUseCase = new UpdatePayments(
  paymentsRepository,
  transactionsRepository,
  purchasesRepository,
  feesRepository
);

// Controlador
const paymentsController = new PaymentsController(
  getPaymentsUseCase,
  updatePaymentsUseCase
);

// GET BY ID
router.get(
  "/:id",
  authorize([Role.ADMIN, Role.USER]),
  [check("id", "El id es obligatorio").not().isEmpty(), catchValidationErrors],
  paymentsController.getById.bind(paymentsController)
);

// GET ALL ACCOUNTS
router.get(
  "/accounts/all/",
  authorize([Role.ADMIN, Role.USER]),
  paymentsController.getAllAccounts.bind(paymentsController)
);

// GET ACCOUNT BY ID
router.get(
  "/accounts/single/:id",
  authorize([Role.ADMIN, Role.USER]),
  paymentsController.getAccountById.bind(paymentsController)
);

// GET ALL BY TYPE
router.get(
  "/all/type/:type",
  authorize([Role.ADMIN, Role.USER]),
  paymentsController.getAllByType.bind(paymentsController)
);

// GET ALL BY REFERENCE
router.get(
  "/all/reference/:reference",
  authorize([Role.ADMIN, Role.USER]),
  paymentsController.getAllByReference.bind(paymentsController)
);

// CREATE
router.post(
  "/",
  authorize([Role.ADMIN, Role.USER]),
  paymentsController.create.bind(paymentsController)
);

//   // UPDATE
//   router.put(
//     "/",
//     authorize([Role.ADMIN, Role.USER]),
//     paymentsController.update.bind(paymentsController)
//   );

// DELETE
router.delete(
  "/:id",
  authorize([Role.ADMIN, Role.USER]),
  [check("id", "El id es obligatorio").not().isEmpty(), catchValidationErrors],
  paymentsController.delete.bind(paymentsController)
);

// UPDATE
router.put(
  "/accounts",
  authorize([Role.ADMIN, Role.USER]),
  paymentsController.updateAccountBalance.bind(paymentsController)
);

export { router };
