import { check } from "express-validator";
import { catchValidationErrors } from "../error/validate-fileds";
import authorize from "../middlewares/authorize";
import { Role } from "../../../modules/users/domain";
import { MySQLProductRepository } from "../../../modules/products/infrastructure/mysql-products.repository";
import { Router } from "express";
import { ProductController } from "../controllers/products.controller";
import { CreateProductUseCase } from "../../../modules/products/application/use-caes/create.use-cases";
import { DeleteProductUseCase } from "../../../modules/products/application/use-caes/delete.use-cases";
import { UpdateProductUseCase } from "../../../modules/products/application/use-caes/update.use-cases";
import { GetProductsUseCase } from "../../../modules/products/application/use-caes/get.use-cases";

const router = Router();

// Repositorio
const productsRepository = new MySQLProductRepository();

// Casos de uso
const createProductUseCase = new CreateProductUseCase(productsRepository);
const getProductUseCase = new GetProductsUseCase(productsRepository);
const updateProductUseCase = new UpdateProductUseCase(productsRepository);
const deleteProductUseCase = new DeleteProductUseCase(productsRepository);

// Controlador
const productController = new ProductController(
  createProductUseCase,
  getProductUseCase,
  updateProductUseCase,
  deleteProductUseCase
);

// GET BY ID
router.get(
  "/:id",
  authorize([Role.ADMIN, Role.USER]),
  [check("id", "El id es obligatorio").not().isEmpty(), catchValidationErrors],
  productController.getById.bind(productController)
);

// GET ALL
router.get(
  "/",
  authorize([Role.ADMIN, Role.USER]),
  productController.getAll.bind(productController)
);

// GET ALL FILTERED
router.get(
  "/all/filtered",
  authorize([Role.ADMIN, Role.USER]),
  productController.getAllFiltered.bind(productController)
);

// CREATE
router.post(
  "/",
  authorize([Role.ADMIN, Role.USER]),
  productController.create.bind(productController)
);

// UPDATE
router.put(
  "/",
  authorize([Role.ADMIN, Role.USER]),
  productController.update.bind(productController)
);

// DELETE
router.delete(
  "/:id",
  authorize([Role.ADMIN, Role.USER]),
  [check("id", "El id es obligatorio").not().isEmpty(), catchValidationErrors],
  productController.deleteProduct.bind(productController)
);

// ACTIVATE
router.put(
  "/activate/:id",
  authorize([Role.ADMIN, Role.USER]),
  [check("id", "El id es obligatorio").not().isEmpty(), catchValidationErrors],
  productController.makeActive.bind(productController)
);

// BLOCK
router.put(
  "/block/:id",
  authorize([Role.ADMIN, Role.USER]),
  [check("id", "El id es obligatorio").not().isEmpty(), catchValidationErrors],
  productController.makeInactive.bind(productController)
);

// GET ALL CATEGORIES
router.get(
  "/details/categories",
  authorize([Role.ADMIN, Role.USER]),
  productController.getCategories.bind(productController)
);

// GET ALL SUBCATEGORIES
router.get(
  "/details/subcategories",
  authorize([Role.ADMIN, Role.USER]),
  productController.getSubCategories.bind(productController)
);

// CREATE SUBCATEGORY
router.post(
  "/details/subcategories",
  authorize([Role.ADMIN, Role.USER]),
  productController.createSubcategory.bind(productController)
);

// DELETE SUBCATEGORY
router.delete(
  "/details/subcategories/:id",
  authorize([Role.ADMIN, Role.USER]),
  [check("id", "El id es obligatorio").not().isEmpty(), catchValidationErrors],
  productController.deleteSubCategory.bind(productController)
);

// ENROLL subcategories
router.put(
  "/enroll/subcategories/",
  authorize([Role.ADMIN, Role.USER]),
  [check("id", "El id es obligatorio").not().isEmpty(), catchValidationErrors],
  productController.enrollSubcategories.bind(productController)
);

// ENROLL Ancestor
router.put(
  "/enroll/ancestors/",
  authorize([Role.ADMIN, Role.USER]),
  [check("id", "El id es obligatorio").not().isEmpty(), catchValidationErrors],
  productController.enrollAncestors.bind(productController)
);

export { router };
