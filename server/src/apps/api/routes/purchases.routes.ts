import { check } from "express-validator";
import { catchValidationErrors } from "../error/validate-fileds";
import authorize from "../middlewares/authorize";
import { Role } from "../../../modules/users/domain";
import { Router } from "express";
import { GetHarvests } from "../../../modules/purchases/application/harvests-use-cases/get-harvests.use-cases";
import { PurchasesController } from "../controllers/purchases.controller";
import { UpdateHarvests } from "../../../modules/purchases/application/harvests-use-cases/update-harvests.use-case";
import { GetPurchases } from "../../../modules/purchases/application/purchases-use-cases/get-purchases.use-cases";
import { UpdatePurchase } from "../../../modules/purchases/application/purchases-use-cases/update-purchases.use-case";
import { MySqlPurchasesRepository } from "../../../modules/purchases/infrastructure/mysql-purchases.repository";
import { MySQLProductRepository } from "../../../modules/products/infrastructure/mysql-products.repository";

const router = Router();

// Repositorio
const purchasesRepository = new MySqlPurchasesRepository();
const productRepository = new MySQLProductRepository();

// Casos de uso
const getPurchasesUseCase = new GetPurchases(purchasesRepository);
const updatePurchasesUseCase = new UpdatePurchase(
  purchasesRepository,
  productRepository
);
const getHarvestsUseCase = new GetHarvests(purchasesRepository);
const updateHarvestsUseCase = new UpdateHarvests(
  purchasesRepository,
  productRepository
);

// Controlador
const purchasesController = new PurchasesController(
  getPurchasesUseCase,
  updatePurchasesUseCase,
  getHarvestsUseCase,
  updateHarvestsUseCase
);

// GET BY ID
router.get(
  "/purchases/single/:id",
  authorize([Role.ADMIN, Role.USER]),
  [check("id", "El id es obligatorio").not().isEmpty(), catchValidationErrors],
  purchasesController.getPurchaseById.bind(purchasesController)
);

// GET ALL
router.get(
  "/purchases/all",
  authorize([Role.ADMIN, Role.USER]),
  purchasesController.getAllPurchases.bind(purchasesController)
);

// GET ALL PURCHASES BY PROVIDEER
router.get(
  "/purchases/all/provider/:id",
  authorize([Role.ADMIN, Role.USER]),
  purchasesController.getAllPurchasesByProvider.bind(purchasesController)
);

// CREATE
router.post(
  "/purchases",
  authorize([Role.ADMIN, Role.USER]),
  purchasesController.createPurchase.bind(purchasesController)
);

// UPDATE
router.put(
  "/purchases",
  authorize([Role.ADMIN, Role.USER]),
  purchasesController.updatePurchase.bind(purchasesController)
);

// DELETE
router.delete(
  "/purchases/:id",
  authorize([Role.ADMIN, Role.USER]),
  [check("id", "El id es obligatorio").not().isEmpty(), catchValidationErrors],
  purchasesController.deletePurchase.bind(purchasesController)
);

// GET BY ID
router.get(
  "/harvests/single/:id",
  authorize([Role.ADMIN, Role.USER]),
  [check("id", "El id es obligatorio").not().isEmpty(), catchValidationErrors],
  purchasesController.getHarvestById.bind(purchasesController)
);

// GET ALL
router.get(
  "/harvests/all",
  authorize([Role.ADMIN, Role.USER]),
  purchasesController.getAllHarvests.bind(purchasesController)
);

// GET ALL HARVEST BY CULTIVATOR
router.get(
  "/purchases/all/cultivator/:id",
  authorize([Role.ADMIN, Role.USER]),
  purchasesController.getAllHarvestsByCultivator.bind(purchasesController)
);

// GET ALL HARVEST BY VARIETY
router.get(
  "/purchases/all/variety/:id",
  authorize([Role.ADMIN, Role.USER]),
  purchasesController.getAllHarvestsByVariety.bind(purchasesController)
);

// CREATE
router.post(
  "/harvests",
  authorize([Role.ADMIN, Role.USER]),
  purchasesController.createHarvest.bind(purchasesController)
);

// UPDATE STOCK
router.put(
  "/harvests/stock",
  authorize([Role.ADMIN, Role.USER]),
  purchasesController.updateHarvestStock.bind(purchasesController)
);

// UPDATE LOSS
router.put(
  "/harvests/loss",
  authorize([Role.ADMIN, Role.USER]),
  purchasesController.updateHarvestLoss.bind(purchasesController)
);

// UPDATE MANICURED
router.put(
  "/harvests/manicured",
  authorize([Role.ADMIN, Role.USER]),
  purchasesController.updateHarvestManicured.bind(purchasesController)
);

// UPDATE FEE
router.put(
  "/harvests/fee",
  authorize([Role.ADMIN, Role.USER]),
  purchasesController.updateHarvestFee.bind(purchasesController)
);

// DELETE
router.delete(
  "/harvests/:id",
  authorize([Role.ADMIN, Role.USER]),
  [check("id", "El id es obligatorio").not().isEmpty(), catchValidationErrors],
  purchasesController.deleteHarvest.bind(purchasesController)
);

export { router };
