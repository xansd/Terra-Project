import {
  CreateUserUseCase,
  GetUserUseCase,
  GetAllUsersUseCase,
  UpdatePasswordeUseCase,
  DeleteUserUseCase,
  ActivateUserUseCase,
  UpdateRoleUseCase,
} from "../../../modules/users/application";
import { Request, Response } from "express";
import { IUserController } from "../../../modules/users/application/use-cases/ports/user-controller.port";
import {
  DefaultPasswordError,
  InvalidCredentialsError,
  PasswordHistoryError,
  UserAlreadyExistsError,
  UserDoesNotExistError,
  UserHasToResetError,
  UserNotActive,
  UsersNotFoundError,
} from "../../../modules/users/domain";
import { UserMapper } from "../../../modules/users/application/user-dto.mapper";
import {
  BadRequest,
  NotFound,
  InternalServerError,
  Conflict,
  Forbidden,
  HasToReset,
} from "../error/http-error";
import { DomainValidationError } from "../../../modules/shared/domain/domain-validation.exception";
import {
  LoginRequest,
  SigninUseCase,
} from "../../../modules/users/application/use-cases/signin.use-case";
import { AuthToken } from "../../../modules/shared/domain/value-objects/auth-token";
import { CheckPasswordUseCase } from "../../../modules/users/application/use-cases/check-password.use-case";
import config from "../../../config/app-config";

export class UserController implements IUserController {
  userMapper = new UserMapper();

  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly getUserUseCase: GetUserUseCase,
    private readonly getAllUsersUseCase: GetAllUsersUseCase,
    private readonly updatePasswordUseCase: UpdatePasswordeUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
    private readonly activateUserUseCase: ActivateUserUseCase,
    private readonly updateRoleUseCase: UpdateRoleUseCase,
    private readonly signinUseCase: SigninUseCase,
    private readonly checkPasswordUseCase: CheckPasswordUseCase
  ) {}

  async signin(request: Request, response: Response): Promise<void> {
    const { email, password } = request.body;
    const loginRequest: LoginRequest = {
      email,
      password,
    };
    try {
      const token: AuthToken = await this.signinUseCase.signin(loginRequest);
      response.json(token);
    } catch (error) {
      if (error instanceof DomainValidationError) {
        response.send(BadRequest(error.message));
      } else if (error instanceof UserDoesNotExistError) {
        response.send(BadRequest(error.message));
      } else if (error instanceof InvalidCredentialsError) {
        response.send(Forbidden(error.message));
      } else if (error instanceof UserNotActive) {
        response.send(Forbidden(error.message));
      } else if (error instanceof UserHasToResetError) {
        response.send(HasToReset(error.message));
      } else {
        response.send(InternalServerError(error));
      }
    }
  }

  async getById(request: Request, response: Response): Promise<void> {
    const { id } = request.params;
    try {
      const user = await this.getUserUseCase.getUser(id);
      response.json(this.userMapper.toDTO(user));
    } catch (error) {
      if (error instanceof DomainValidationError) {
        response.send(BadRequest(error.message));
      } else if (error instanceof UserDoesNotExistError) {
        response.send(NotFound(error.message));
      } else {
        response.send(InternalServerError(error));
      }
    }
  }

  async getAll(request: Request, response: Response): Promise<void> {
    try {
      const users = await this.getAllUsersUseCase.getAllUsers();
      const usersDTOs = this.userMapper.toDTOList(users);
      response.json(usersDTOs);
    } catch (error: any) {
      if (error instanceof DomainValidationError) {
        response.send(BadRequest(error.message));
      } else if (error instanceof UsersNotFoundError) {
        response.send(NotFound(error.message));
      } else {
        response.send(InternalServerError(error));
      }
    }
  }

  async create(request: Request, response: Response): Promise<void> {
    const { email, role_id } = request.body;
    try {
      const user = await this.createUserUseCase.createUser(email, role_id);

      response.json(this.userMapper.toDTO(user));
    } catch (error) {
      if (error instanceof DomainValidationError) {
        response.send(BadRequest(error.message));
      } else if (error instanceof UserAlreadyExistsError) {
        response.send(Conflict(error.message));
      } else {
        response.send(InternalServerError(error));
      }
    }
  }

  async updatePassword(request: Request, response: Response): Promise<void> {
    try {
      let { id, password, isAdminAction } = request.body;
      if (isAdminAction) password = config.DEFAULT_USER_PASSWORD;
      const result = await this.updatePasswordUseCase.updatePassword({
        id,
        password,
        isAdminAction,
      });
      response.json(result);
    } catch (error) {
      if (error instanceof DomainValidationError) {
        response.send(BadRequest(error.message));
      } else if (error instanceof PasswordHistoryError) {
        response.send(BadRequest(error.message));
      } else if (error instanceof UserDoesNotExistError) {
        response.send(NotFound(error.message));
      } else if (error instanceof DefaultPasswordError) {
        response.send(Conflict(error.message));
      } else {
        response.send(InternalServerError(error));
      }
    }
  }

  async checkPassword(request: Request, response: Response): Promise<void> {
    try {
      const { email, password } = request.body;
      const result = await this.checkPasswordUseCase.checkPassword({
        email,
        password,
      });
      response.json(result);
    } catch (error) {
      if (error instanceof DomainValidationError) {
        response.send(BadRequest(error.message));
      } else if (error instanceof InvalidCredentialsError) {
        response.send(Forbidden(error.message));
      } else if (error instanceof PasswordHistoryError) {
        response.send(BadRequest(error.message));
      } else if (error instanceof UserDoesNotExistError) {
        response.send(NotFound(error.message));
      } else if (error instanceof DefaultPasswordError) {
        response.send(Conflict(error.message));
      } else {
        response.send(InternalServerError(error));
      }
    }
  }

  async updateRole(request: Request, response: Response): Promise<void> {
    try {
      const { id } = request.params;
      const role = request.body.role_id;
      const result = await this.updateRoleUseCase.updateRole(id, role);
      response.json(result);
    } catch (error) {
      if (error instanceof DomainValidationError) {
        response.send(BadRequest(error.message));
      } else if (error instanceof UserDoesNotExistError) {
        response.send(NotFound(error.message));
      } else {
        response.send(InternalServerError(error));
      }
    }
  }

  // async update(request: Request, response: Response): Promise<void> {
  //   try {
  //     const result = await this.updateUserUseCase.updateUser(request.body);
  //     response.send(result);
  //   } catch (error) {
  //     if (error instanceof DomainValidationError) {
  //       response.send(BadRequest(error.message));
  //     } else if (error instanceof UserDoesNotExistError) {
  //       response.send(NotFound(error.message));
  //     } else {
  //       response.send(InternalServerError(error));
  //     }
  //   }
  // }

  async delete(request: Request, response: Response): Promise<void> {
    const { id } = request.params;

    try {
      const result = await this.deleteUserUseCase.deleteUser(id);
      response.send(result);
    } catch (error) {
      if (error instanceof DomainValidationError) {
        response.send(BadRequest(error.message));
      } else if (error instanceof UserDoesNotExistError) {
        response.send(NotFound(error.message));
      } else {
        response.send(InternalServerError(error));
      }
    }
  }

  async activate(request: Request, response: Response): Promise<void> {
    const { id } = request.params;
    try {
      const result = await this.activateUserUseCase.activateUser(id);
      response.send(result);
    } catch (error) {
      if (error instanceof DomainValidationError) {
        response.send(BadRequest(error.message));
      } else if (error instanceof UserDoesNotExistError) {
        response.send(NotFound(error.message));
      } else {
        response.send(InternalServerError(error));
      }
    }
  }

  async block(request: Request, response: Response): Promise<void> {
    const { id } = request.params;
    try {
      const result = await this.activateUserUseCase.blockUser(id);
      response.send(result);
    } catch (error) {
      if (error instanceof DomainValidationError) {
        response.send(BadRequest(error.message));
      } else if (error instanceof UserDoesNotExistError) {
        response.send(NotFound(error.message));
      } else {
        response.send(InternalServerError(error));
      }
    }
  }
}
