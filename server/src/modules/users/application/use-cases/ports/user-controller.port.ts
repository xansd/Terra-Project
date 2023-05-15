import { Request, Response } from "express";

export interface IUserController {
  getById<T>(request: Request, response: Response): Promise<void>;
  getAll<T>(request: Request, response: Response): Promise<void>;
  create<T>(request: Request, response: Response): Promise<void>;
  update<T>(request: Request, response: Response): Promise<void>;
  updatePassword<T>(request: Request, response: Response): Promise<void>;
  delete<T>(request: Request, response: Response): Promise<void>;
  activate<T>(request: Request, response: Response): Promise<void>;
  block<T>(request: Request, response: Response): Promise<void>;
  signin<T>(request: Request, response: Response): Promise<void>;
  checkPassword<T>(request: Request, response: Response): Promise<void>;
}
