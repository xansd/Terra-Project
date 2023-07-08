import { FeesDTOMapper } from "../../../modules/fees/application/fees.mapper";
import { FeesUseCases } from "../../../modules/fees/application/use-cases/fees.use-cases";
import { Request, Response } from "express";
import { BadRequest, Conflict, InternalServerError } from "../error/http-error";
import {
  FeeNotFoundError,
  NotANumberError,
} from "../../../modules/fees/domain/fees.exceptions";

export class FeesController {
  feesMapper = new FeesDTOMapper();

  constructor(private feesUseCases: FeesUseCases) {}

  async getById(request: Request, response: Response): Promise<void> {
    const { id } = request.params;
    try {
      const fees = await this.feesUseCases.getPartnerFees(id);
      response.json(this.feesMapper.toDTOList(fees!));
    } catch (error) {
      response.send(InternalServerError(error));
    }
  }
  async getAll(request: Request, response: Response): Promise<void> {
    try {
      const fees = await this.feesUseCases.getAllFees();
      response.json(this.feesMapper.toDTOList(fees!));
    } catch (error) {
      response.send(InternalServerError(error));
    }
  }
  async getTypes(request: Request, response: Response): Promise<void> {
    try {
      const types = await this.feesUseCases.getTypes();
      response.json(types);
    } catch (error: any) {
      response.send(InternalServerError(error));
    }
  }
  async create(request: Request, response: Response): Promise<void> {
    try {
      const fee = await this.feesUseCases.createFee(
        request.body,
        request.auth.id
      );
      const feeDTOs = this.feesMapper.toDTO(fee!);
      response.json(feeDTOs);
    } catch (error) {
      response.send(InternalServerError(error));
    }
  }
  async update(request: Request, response: Response): Promise<void> {
    try {
      const result = await this.feesUseCases.updateFee(
        request.body,
        request.auth.id
      );
      response.send(result);
    } catch (error) {
      if (error instanceof FeeNotFoundError) {
        response.send(BadRequest(error.message));
      } else {
        response.send(InternalServerError(error));
      }
    }
  }
  async delete(request: Request, response: Response): Promise<void> {
    const { id } = request.params;
    try {
      const result = await this.feesUseCases.deleteFee(id, request.auth.id);
      response.send(result);
    } catch (error) {
      if (error instanceof FeeNotFoundError) {
        response.send(BadRequest(error.message));
      } else {
        response.send(InternalServerError(error));
      }
    }
  }

  async payFee(request: Request, response: Response): Promise<void> {
    try {
      const result = await this.feesUseCases.payFee(
        request.body,
        request.auth.id
      );
      response.send(result);
    } catch (error) {
      if (error instanceof FeeNotFoundError) {
        response.send(BadRequest(error.message));
      } else if (error instanceof NotANumberError) {
        response.send(Conflict(error.message));
      } else {
        response.send(InternalServerError(error));
      }
    }
  }
}
