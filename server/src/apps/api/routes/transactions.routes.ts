import { Router } from "express";
import { check } from "express-validator";
import { Role } from "../../../modules/users/domain";
import { catchValidationErrors } from "../error/validate-fileds";
import authorize from "../middlewares/authorize";
import { GetTransactions } from "../../../modules/transactions/application/use-cases/get-transactions.use-cases";
import { UpdateTransactions } from "../../../modules/transactions/application/use-cases/update-transactions.use-case";
import { MySqlTransactionsRepository } from "../../../modules/transactions/infrastructure/mysql-transactions.repository";
import { TransactionsController } from "../controllers/transactions.controller";

const router = Router();

// Repositorio
const transactionsRepository = new MySqlTransactionsRepository();

// Casos de uso
const getTransactionsUseCase = new GetTransactions(transactionsRepository);
const updateTransactionsUseCase = new UpdateTransactions(
  transactionsRepository
);

// Controlador
const transactionsController = new TransactionsController(
  getTransactionsUseCase,
  updateTransactionsUseCase
);

// GET BY ID
router.get(
  "/:id",
  authorize([Role.ADMIN, Role.USER]),
  [check("id", "El id es obligatorio").not().isEmpty(), catchValidationErrors],
  transactionsController.getById.bind(transactionsController)
);

// GET ALL INCOMES
router.get(
  "/all/incomes",
  authorize([Role.ADMIN, Role.USER]),
  transactionsController.getAllIncomes.bind(transactionsController)
);

// GET ALL EXPENSES
router.get(
  "/all/expenses",
  authorize([Role.ADMIN, Role.USER]),
  transactionsController.getAllExpenses.bind(transactionsController)
);

// GET ALL BY TYPE
router.get(
  "/all/type/:type",
  authorize([Role.ADMIN, Role.USER]),
  transactionsController.getAllTransactionsByType.bind(transactionsController)
);

// CREATE
router.post(
  "/",
  authorize([Role.ADMIN, Role.USER]),
  transactionsController.create.bind(transactionsController)
);

// DELETE
router.delete(
  "/:id",
  authorize([Role.ADMIN, Role.USER]),
  [check("id", "El id es obligatorio").not().isEmpty(), catchValidationErrors],
  transactionsController.delete.bind(transactionsController)
);

export { router };
