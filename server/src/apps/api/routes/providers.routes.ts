import { Router } from "express";
import { check } from "express-validator";
import { Role } from "../../../modules/users/domain";
import { catchValidationErrors } from "../error/validate-fileds";
import authorize from "../middlewares/authorize";
import { MySqlProvidersRepository } from "../../../modules/providers/infrastructure/mysql-providers.repository";
import { GetProviders } from "../../../modules/providers/application/use-cases/get-providers.use-cases";
import { UpdateProviders } from "../../../modules/providers/application/use-cases/update-providers.use-case";
import { ProviderController } from "../controllers/providers.controller";

const router = Router();

// Repositorio
const providersRepository = new MySqlProvidersRepository();

// Casos de uso
const getProvidersUseCase = new GetProviders(providersRepository);
const updateProvidersUseCase = new UpdateProviders(providersRepository);

// Controlador
const providersController = new ProviderController(
  getProvidersUseCase,
  updateProvidersUseCase
);

// GET BY ID
router.get(
  "/:id",
  authorize([Role.ADMIN, Role.USER]),
  [check("id", "El id es obligatorio").not().isEmpty(), catchValidationErrors],
  providersController.getById.bind(providersController)
);

// GET ALL
router.get(
  "/all/type/:type",
  authorize([Role.ADMIN, Role.USER]),
  providersController.getAll.bind(providersController)
);

// CREATE
router.post(
  "/",
  authorize([Role.ADMIN, Role.USER]),
  providersController.create.bind(providersController)
);

// UPDATE
router.put(
  "/",
  authorize([Role.ADMIN, Role.USER]),
  providersController.update.bind(providersController)
);

// DELETE
router.delete(
  "/:id",
  authorize([Role.ADMIN, Role.USER]),
  [check("id", "El id es obligatorio").not().isEmpty(), catchValidationErrors],
  providersController.delete.bind(providersController)
);

export { router };
