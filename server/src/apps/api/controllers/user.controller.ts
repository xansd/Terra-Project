import {
  CreateUserUseCase,
  GetUserUseCase,
  GetAllUsersUseCase,
  UpdatePasswordeUseCase,
  DeleteUserUseCase,
  UpdateUserUseCase,
  ActivateUserUseCase,
  UpdateRoleUseCase,
} from "../../../modules/users/application";
import { Request, Response } from "express";
import { IUserController } from "../../../modules/users/application/use-cases/interface/user-controller.interface";
import {
  Role,
  UserAlreadyExistsError,
  UserDoesNotExistError,
  UsersNotFoundError,
} from "../../../modules/users/domain";
import { UserAdapter } from "../../../modules/users/application/user.adapter";
import {
  BadRequest,
  NotFound,
  InternalServerError,
  Conflict,
} from "../error/http-error";
import { DomainValidationError } from "../../../modules/shared/domain/domain-validation.exception";

export class UserController implements IUserController {
  userAdapter = new UserAdapter();

  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly getUserUseCase: GetUserUseCase,
    private readonly getAllUsersUseCase: GetAllUsersUseCase,
    private readonly updatePasswordUseCase: UpdatePasswordeUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
    private readonly activateUserUseCase: ActivateUserUseCase,
    private readonly updateRoleUseCase: UpdateRoleUseCase
  ) {}

  async getById(request: Request, response: Response): Promise<void> {
    const { id } = request.params;
    try {
      const user = await this.getUserUseCase.getUser(id);
      response.send(this.userAdapter.toDTO(user));
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
      response.send(this.userAdapter.toDTOList(users));
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
    const { email, password } = request.body;
    const role = Role.USER;
    try {
      const user = await this.createUserUseCase.createUser({
        email,
        password,
        role,
      });

      response.send(this.userAdapter.toDTO(user));
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
      const user = await this.updatePasswordUseCase.updatePassword(
        request.body
      );
      response.send();
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

  async updateRole(request: Request, response: Response): Promise<void> {
    try {
      const user = await this.updateRoleUseCase.updateRole(request.body);
      response.send();
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

  async update(request: Request, response: Response): Promise<void> {
    try {
      const user = await this.updateUserUseCase.updateUser(request.body);
      response.send();
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

  async delete(request: Request, response: Response): Promise<void> {
    const { id } = request.params;

    try {
      await this.deleteUserUseCase.deleteUser(id);
      response.send();
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
      await this.activateUserUseCase.activateUser(id);
      response.send();
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
      await this.activateUserUseCase.blockUser(id);
      response.send();
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
