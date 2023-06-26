import { check } from "express-validator";
import { catchValidationErrors } from "../error/validate-fileds";
import authorize from "../middlewares/authorize";
import { Role } from "../../../modules/users/domain";
import { Router } from "express";
import { GetSales } from "../../../modules/sales/application/use-cases/get-sales.use-cases";
import { MySqlSalesRepository } from "../../../modules/sales/infrastructure/mysql-sales.repository";
import { SalesController } from "../controllers/sales.controller";
import { UpdateSales } from "../../../modules/sales/application/use-cases/update-sales.use-case";

const router = Router();

// Repositorio
const salesRepository = new MySqlSalesRepository();

// Casos de uso
const getSalesUseCase = new GetSales(salesRepository);
const updateSalesUseCase = new UpdateSales(salesRepository);

// Controlador
const salesController = new SalesController(
  getSalesUseCase,
  updateSalesUseCase
);

// GET BY ID
router.get(
  "/:id",
  authorize([Role.ADMIN, Role.USER]),
  [check("id", "El id es obligatorio").not().isEmpty(), catchValidationErrors],
  salesController.getById.bind(salesController)
);

// GET ALL
router.get(
  "/",
  authorize([Role.ADMIN, Role.USER]),
  salesController.getAll.bind(salesController)
);

// GET ALL PARTNER SALES
router.get(
  "/partner/:id",
  authorize([Role.ADMIN, Role.USER]),
  [check("id", "El id es obligatorio").not().isEmpty(), catchValidationErrors],
  salesController.getAllPartnerSales.bind(salesController)
);

// CREATE
router.post(
  "/",
  authorize([Role.ADMIN, Role.USER]),
  salesController.create.bind(salesController)
);

// // UPDATE
// router.put(
//   "/",
//   authorize([Role.ADMIN, Role.USER]),
//   salesController.updatePurchase.bind(salesController)
// );

// DELETE
router.delete(
  "/:id",
  authorize([Role.ADMIN, Role.USER]),
  [check("id", "El id es obligatorio").not().isEmpty(), catchValidationErrors],
  salesController.delete.bind(salesController)
);

export { router };
