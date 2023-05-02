import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import {
  ActivateUserUseCase,
  CreateUserUseCase,
  DeleteUserUseCase,
  GetAllUsersUseCase,
  GetUserUseCase,
  UpdateRoleUseCase,
  UpdateUserUseCase,
} from "../../../modules/users/application";
import { check } from "express-validator";

import { UpdatePasswordeUseCase } from "../../../modules/users/application/use-cases/update-password.use-case";
import { catchValidationErrors } from "../middlewares/validate-fileds";
import { MySqlUserRepository } from "../../../modules/users/infraestructure/mysql/mysql-user.repository";

const router = Router();

// Repositorio de usuarios
const userRepository = new MySqlUserRepository();

// Caosos de uso de usuarios
const createUserUseCase = new CreateUserUseCase(userRepository);
const getUserUseCase = new GetUserUseCase(userRepository);
const getAllUsersUseCase = new GetAllUsersUseCase(userRepository);
const updatePasswordeUseCase = new UpdatePasswordeUseCase(userRepository);
const updateUserUseCase = new UpdateUserUseCase(userRepository);
const deleteUserUseCase = new DeleteUserUseCase(userRepository);
const activateUserUseCase = new ActivateUserUseCase(userRepository);
const updateRoleUseCase = new UpdateRoleUseCase(userRepository);

// Controlador de usuarios
const userController = new UserController(
  createUserUseCase,
  getUserUseCase,
  getAllUsersUseCase,
  updatePasswordeUseCase,
  updateUserUseCase,
  deleteUserUseCase,
  activateUserUseCase,
  updateRoleUseCase
);

// GET BY ID
router.get(
  "/:id",
  [check("id", "El id es obligatorio").not().isEmpty()],
  userController.getById.bind(userController)
);
// GET ALL
router.get("/", userController.getAll.bind(userController));
router.post(
  "/",
  [
    // Validamos que los campos no lleguen vacíos
    check("email", "El email es obligatorio").not().isEmpty(),
    check("password", "El password es obligatorio").not().isEmpty(),
    catchValidationErrors,
  ],
  userController.create.bind(userController)
);
// UPDATE PASSWORD
router.put(
  "/update-password/",
  [
    check("id", "El id es obligatorio").not().isEmpty(),
    check("email", "El email es obligatorio").not().isEmpty(),
    check("password", "El password es obligatorio").not().isEmpty(),
    catchValidationErrors,
  ],
  userController.updatePassword.bind(userController)
);
// UPDATE
router.put(
  "/",
  [
    check("id", "El id es obligatorio").not().isEmpty(),
    check("email", "El email es obligatorio").not().isEmpty(),
    catchValidationErrors,
  ],
  userController.update.bind(userController)
);

// UPDATE ROLE
router.put(
  "/role/",
  [
    check("id", "El id es obligatorio").not().isEmpty(),
    check("role", "El role es obligatorio").not().isEmpty(),
    catchValidationErrors,
  ],
  userController.updateRole.bind(userController)
);

// DELETE
router.delete(
  "/:id",
  [check("id", "El id es obligatorio").not().isEmpty()],
  userController.delete.bind(userController)
);

// ACTIVATE
router.put(
  "/activate/:id",
  [check("id", "El id es obligatorio").not().isEmpty()],
  userController.activate.bind(userController)
);

// BLOCK
router.put(
  "/block/:id",
  [check("id", "El id es obligatorio").not().isEmpty()],
  userController.block.bind(userController)
);

export { router };
