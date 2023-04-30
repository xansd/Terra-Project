import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import {
  CreateUserService,
  GetAllUsersService,
  GetUserService,
} from "../../../application";
import { MySqlUserRepository } from "../../repositories";
import { check } from "express-validator";
import { catchValidationErrors } from "../../../../shared";
import { UpdatePasswordeService } from "../../../application/services/update-password-service";

const router = Router();

// Repositorio de usuarios
const userRepository = new MySqlUserRepository();

// Servicios de usuarios
const createUserService = new CreateUserService(userRepository);
const getUserService = new GetUserService(userRepository);
const getAllUsersService = new GetAllUsersService(userRepository);
const updatePasswordeService = new UpdatePasswordeService(userRepository);

// Controlador de usuarios
const userController = new UserController(
  createUserService,
  getUserService,
  getAllUsersService,
  updatePasswordeService
);

// Rutas de usuarios
router.get(
  "/:id",
  [check("id", "El id es obligatorio").not().isEmpty()],
  userController.getById.bind(userController)
);
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
// router.get("/:id", userController.getById);
// router.get("/", userController.getAll);
// router.put("/:id", userController.update);
// router.delete("/:id", deleteUserController.delete);

export { router };
