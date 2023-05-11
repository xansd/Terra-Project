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
import { catchValidationErrors } from "../error/validate-fileds";
import { MySqlUserRepository } from "../../../modules/users/infraestructure/mysql/mysql-user.adapter";
import authorize from "../middlewares/authorize";
import { Role } from "../../../modules/users/domain";
import { SigninUseCase } from "../../../modules/users/application/use-cases/signin.use-case";

const router = Router();

// Repositorio de usuarios
const userRepository = new MySqlUserRepository();

// Casos de uso de usuarios
const createUserUseCase = new CreateUserUseCase(userRepository);
const getUserUseCase = new GetUserUseCase(userRepository);
const getAllUsersUseCase = new GetAllUsersUseCase(userRepository);
const updatePasswordeUseCase = new UpdatePasswordeUseCase(userRepository);
const updateUserUseCase = new UpdateUserUseCase(userRepository);
const deleteUserUseCase = new DeleteUserUseCase(userRepository);
const activateUserUseCase = new ActivateUserUseCase(userRepository);
const updateRoleUseCase = new UpdateRoleUseCase(userRepository);
const signinUseCase = new SigninUseCase(userRepository);

// Controlador de usuarios
const userController = new UserController(
  createUserUseCase,
  getUserUseCase,
  getAllUsersUseCase,
  updatePasswordeUseCase,
  updateUserUseCase,
  deleteUserUseCase,
  activateUserUseCase,
  updateRoleUseCase,
  signinUseCase
);

// LOGIN
router.post(
  "/signin",
  [
    // Validamos que los campos no lleguen vacíos
    check("email", "El email es obligatorio").not().isEmpty(),
    check("password", "El password es obligatorio").not().isEmpty(),
    catchValidationErrors,
  ],
  userController.signin.bind(userController)
);

// SIGNUP ERP
router.post(
  "/",
  authorize([Role.ADMIN]),
  [
    // Validamos que los campos no lleguen vacíos
    check("email", "El email es obligatorio").not().isEmpty(),
    check("password", "El password es obligatorio").not().isEmpty(),
    catchValidationErrors,
  ],
  userController.create.bind(userController)
);

// SIGNUP SOCIOS
router.post(
  "/signup ",
  authorize([Role.ADMIN, Role.USER, Role.PARTNER]),
  [
    // Validamos que los campos no lleguen vacíos
    check("email", "El email es obligatorio").not().isEmpty(),
    check("password", "El password es obligatorio").not().isEmpty(),
    catchValidationErrors,
  ],
  userController.create.bind(userController)
);

// GET BY ID
router.get(
  "/:id",
  // authorize([Role.ADMIN]),
  [check("id", "El id es obligatorio").not().isEmpty()],
  userController.getById.bind(userController)
);

// GET ALL
router.get(
  "/",
  authorize([Role.ADMIN, Role.USER]),
  userController.getAll.bind(userController)
);

// UPDATE PASSWORD
router.put(
  "/update-password/",
  authorize([Role.ADMIN, Role.USER, Role.PARTNER]),
  [
    check("id", "El id es obligatorio").not().isEmpty(),
    check("email", "El email es obligatorio").not().isEmpty(),
    check("password", "El password es obligatorio").not().isEmpty(),
    catchValidationErrors,
  ],
  userController.updatePassword.bind(userController)
);
// UPDATE
// router.put(
//   "/",
//   authorize([Role.ADMIN, Role.USER, Role.PARTNER]),
//   [
//     check("id", "El id es obligatorio").not().isEmpty(),
//     check("email", "El email es obligatorio").not().isEmpty(),
//     catchValidationErrors,
//   ],
//   userController.update.bind(userController)
// );

// UPDATE ROLE
router.put(
  "/role/:id",
  authorize([Role.ADMIN]),
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
  authorize([Role.ADMIN]),
  [check("id", "El id es obligatorio").not().isEmpty()],
  userController.delete.bind(userController)
);

// ACTIVATE
router.put(
  "/activate/:id",
  authorize([Role.ADMIN]),
  [check("id", "El id es obligatorio").not().isEmpty()],
  userController.activate.bind(userController)
);

// BLOCK
router.put(
  "/block/:id",
  authorize([Role.ADMIN]),
  [check("id", "El id es obligatorio").not().isEmpty()],
  userController.block.bind(userController)
);

export { router };
