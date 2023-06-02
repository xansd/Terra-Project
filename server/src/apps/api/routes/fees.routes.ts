import { Router } from "express";
import { MysqlFeesRepository } from "../../../modules/fees/infrastructure/mysql-fees.repository";
import { FeesUseCases } from "../../../modules/fees/application/use-cases/fees.use-cases";
import { FeesController } from "../controllers/fees.controllers";
import authorize from "../middlewares/authorize";
import { Role } from "../../../modules/users/domain";
import { check } from "express-validator";
import { catchValidationErrors } from "../error/validate-fileds";

const router = Router();
const feesRepository = new MysqlFeesRepository();
const feesUseCases = new FeesUseCases(feesRepository);
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
