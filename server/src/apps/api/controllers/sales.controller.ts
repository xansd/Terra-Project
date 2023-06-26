import { Request, Response } from "express";
import { SalesMapper } from "../../../modules/sales/application/sales-dto.mapper";
import { GetSales } from "../../../modules/sales/application/use-cases/get-sales.use-cases";
import { UpdateSales } from "../../../modules/sales/application/use-cases/update-sales.use-case";
import { DomainValidationError } from "../../../modules/shared/domain/domain-validation.exception";
import {
  BadRequest,
  NotFound,
  InternalServerError,
  Conflict,
} from "../error/http-error";
import {
  SaleDoesNotExistError,
  SaleNotFoundError,
  SaleDetailsEnrollError,
} from "../../../modules/sales/domain/sales.exception";

export class SalesController {
  salesMapper = new SalesMapper();

  constructor(
    private readonly getSalesService: GetSales,
    private readonly updateSalesService: UpdateSales
  ) {}

  async getById(request: Request, response: Response): Promise<void> {
    const { id } = request.params;
    try {
      const sales = await this.getSalesService.getById(id);
      response.json(this.salesMapper.toDTO(sales));
    } catch (error) {
      if (error instanceof DomainValidationError) {
        response.send(BadRequest(error.message));
      } else if (error instanceof SaleDoesNotExistError) {
        response.send(NotFound(error.message));
      } else {
        response.send(InternalServerError(error));
      }
    }
  }
  async getAll(request: Request, response: Response): Promise<void> {
    try {
      const sales = await this.getSalesService.getAll();
      const salesDTOs = this.salesMapper.toDTOList(sales);
      response.json(salesDTOs);
    } catch (error: any) {
      if (error instanceof DomainValidationError) {
        response.send(BadRequest(error.message));
      } else if (error instanceof SaleNotFoundError) {
        response.send(NotFound(error.message));
      } else {
        response.send(InternalServerError(error));
      }
    }
  }

  async getAllPartnerSales(
    request: Request,
    response: Response
  ): Promise<void> {
    try {
      const { id } = request.params;
      const sales = await this.getSalesService.getAllPartnerSales(id);
      const salesDTOs = this.salesMapper.toDTOList(sales);
      response.json(salesDTOs);
    } catch (error: any) {
      if (error instanceof DomainValidationError) {
        response.send(BadRequest(error.message));
      } else if (error instanceof SaleNotFoundError) {
        response.send(NotFound(error.message));
      } else {
        response.send(InternalServerError(error));
      }
    }
  }

  async create(request: Request, response: Response): Promise<void> {
    try {
      const sales = await this.updateSalesService.create(request.body);
      const salesDTOs = this.salesMapper.toDTO(sales!);
      response.json(salesDTOs);
    } catch (error) {
      if (error instanceof SaleDetailsEnrollError) {
        response.send(Conflict(error.message));
      } else {
        response.send(InternalServerError(error));
      }
    }
  }

  async delete(request: Request, response: Response): Promise<void> {
    const { id } = request.params;

    try {
      const result = await this.updateSalesService.delete(id);
      response.send(result);
    } catch (error) {
      if (error instanceof DomainValidationError) {
        response.send(BadRequest(error.message));
      } else if (error instanceof SaleDoesNotExistError) {
        response.send(NotFound(error.message));
      } else {
        response.send(InternalServerError(error));
      }
    }
  }
}
