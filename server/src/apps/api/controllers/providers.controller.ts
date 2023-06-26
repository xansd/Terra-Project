import { ProviderMapper } from "../../../modules/providers/application/provider-dto.mapper";
import { GetProviders } from "../../../modules/providers/application/use-cases/get-providers.use-cases";
import { UpdateProviders } from "../../../modules/providers/application/use-cases/update-providers.use-case";
import { Request, Response } from "express";
import {
  ProviderDoesNotExistError,
  ProvidersNotFoundError,
} from "../../../modules/providers/domain/providers.exceptions";
import { DomainValidationError } from "../../../modules/shared/domain/domain-validation.exception";
import {
  BadRequest,
  NotFound,
  InternalServerError,
  Conflict,
} from "../error/http-error";

export class ProviderController {
  providerMapper = new ProviderMapper();

  constructor(
    private readonly getProviderService: GetProviders,
    private readonly updateProviderService: UpdateProviders
  ) {}

  async getById(request: Request, response: Response): Promise<void> {
    const { id } = request.params;
    try {
      const payment = await this.getProviderService.getById(id);
      response.json(this.providerMapper.toDTO(payment));
    } catch (error) {
      if (error instanceof DomainValidationError) {
        response.send(BadRequest(error.message));
      } else if (error instanceof ProviderDoesNotExistError) {
        response.send(NotFound(error.message));
      } else {
        response.send(InternalServerError(error));
      }
    }
  }
  async getAll(request: Request, response: Response): Promise<void> {
    try {
      const provider = await this.getProviderService.getAll(request.body.type);
      const providerDTOs = this.providerMapper.toDTOList(provider);
      response.json(providerDTOs);
    } catch (error: any) {
      if (error instanceof DomainValidationError) {
        response.send(BadRequest(error.message));
      } else if (error instanceof ProvidersNotFoundError) {
        response.send(NotFound(error.message));
      } else {
        response.send(InternalServerError(error));
      }
    }
  }
  async create(request: Request, response: Response): Promise<void> {
    try {
      const provider = await this.updateProviderService.create(request.body);
      const providerDTOs = this.providerMapper.toDTO(provider!);
      response.json(providerDTOs);
    } catch (error) {
      response.send(InternalServerError(error));
    }
  }

  async update(request: Request, response: Response): Promise<void> {
    try {
      const result = await this.updateProviderService.updateProvider(
        request.body
      );
      response.send(result);
    } catch (error) {
      if (error instanceof DomainValidationError) {
        response.send(BadRequest(error.message));
      } else if (error instanceof ProviderDoesNotExistError) {
        response.send(Conflict(error.message));
      } else {
        response.send(InternalServerError(error));
      }
    }
  }

  async delete(request: Request, response: Response): Promise<void> {
    const { id } = request.params;

    try {
      const result = await this.updateProviderService.delete(id);
      response.send(result);
    } catch (error) {
      if (error instanceof DomainValidationError) {
        response.send(BadRequest(error.message));
      } else if (error instanceof ProviderDoesNotExistError) {
        response.send(NotFound(error.message));
      } else {
        response.send(InternalServerError(error));
      }
    }
  }
}
