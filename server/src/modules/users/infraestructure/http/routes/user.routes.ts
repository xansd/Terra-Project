import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { CreateUserService } from "../../../application";
import { MySqlUserRepository } from "../../repositories";
import { check } from "express-validator";
import { catchValidationErrors } from "../../../../shared";

const router = Router();
// Repositorio de usuarios
const userRepository = new MySqlUserRepository();
// Servicios de usuarios
const createUserService = new CreateUserService(userRepository);
// Controladores de usuarios
const createUserController = new UserController(createUserService);
// Rutas de usuarios
router.post(
  "/",
  [
    // Validamos que los campos no lleguen vacíos
    check("email", "El email es obligatorio").not().isEmpty(),
    check("password", "El password es obligatorio").not().isEmpty(),
    catchValidationErrors,
  ],
  createUserController.create.bind(createUserController)
);
// router.get("/:id", userController.getById);
// router.get("/", userController.getAll);
// router.put("/:id", userController.update);
// router.delete("/:id", deleteUserController.delete);

export { router };
