import { Request, Response } from "express";
import { ApiResponse } from "../../../shared/infraestructure/interfaces/api-response.interface";

export interface ExtendedResponse<T> extends Response {
  json(body: ApiResponse<T>): this;
}

export interface IUserController {
  getById<T>(request: Request, response: ExtendedResponse<T>): Promise<void>;
  getAll<T>(request: Request, response: ExtendedResponse<T>): Promise<void>;
  create<T>(request: Request, response: ExtendedResponse<T>): Promise<void>;
  update<T>(request: Request, response: ExtendedResponse<T>): Promise<void>;
  delete<T>(request: Request, response: ExtendedResponse<T>): Promise<void>;
}
