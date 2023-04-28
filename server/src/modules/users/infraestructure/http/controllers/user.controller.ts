import { CreateUserService } from "../../../application";
import { Request, Response } from "express";
import { ApiResponse } from "../../../../shared/infraestructure/interfaces/api-response.interface";
import { IUserController } from "../../../application/interfaces/user-controller.interface";
import { IUserDTO } from "../../../application/dtos/user.dto";
import { Role } from "../../../domain";

export class UserController implements IUserController {
  constructor(private readonly createUserService: CreateUserService) {}

  async getById(request: Request, response: Response): Promise<void> {}
  async getAll(request: Request, response: Response): Promise<void> {}
  async update(request: Request, response: Response): Promise<void> {}
  async delete(request: Request, response: Response): Promise<void> {}

  async create(request: Request, response: Response): Promise<void> {
    const { email, password } = request.body;
    const role = Role.USER;

    try {
      const result: ApiResponse<IUserDTO | null> =
        await this.createUserService.createUser({
          email,
          password,
          role,
        });

      response.status(result.code).json(result);
    } catch (error) {
      console.error(error);
      response.status(500).send("Internal server error");
    }
  }
}
