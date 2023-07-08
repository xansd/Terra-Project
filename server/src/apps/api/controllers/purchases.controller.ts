import { Request, Response } from "express";
import { GetHarvests } from "../../../modules/purchases/application/harvests-use-cases/get-harvests.use-cases";
import { PurchasesMapper } from "../../../modules/purchases/application/purchases-dto.mapper";
import { HarvestsMapper } from "../../../modules/purchases/application/harvest-dto.mapper";
import { GetPurchases } from "../../../modules/purchases/application/purchases-use-cases/get-purchases.use-cases";
import { UpdatePurchase } from "../../../modules/purchases/application/purchases-use-cases/update-purchases.use-case";
import { UpdateHarvests } from "../../../modules/purchases/application/harvests-use-cases/update-harvests.use-case";
import {
  PurchaseNotFoundError,
  PurchaseDoesNotExistError,
  PurchaseDetailsEnrollError,
  HarvestDoesNotExistError,
  HarvestNotFoundError,
} from "../../../modules/purchases/domain/purchases.exception";
import { DomainValidationError } from "../../../modules/shared/domain/domain-validation.exception";
import {
  BadRequest,
  NotFound,
  InternalServerError,
  Conflict,
} from "../error/http-error";
import {
  InvalidAmountError,
  MinZeroError,
} from "../../../modules/partners/domain/partner.exceptions";
import { ProductDoesNotExistError } from "../../../modules/products/domain/products.exception";

export class PurchasesController {
  purchasesMapper = new PurchasesMapper();
  harvestsMapper = new HarvestsMapper();

  constructor(
    private readonly getPurchasesService: GetPurchases,
    private readonly updatePurchasesService: UpdatePurchase,
    private readonly getHarvestsService: GetHarvests,
    private readonly updateHarvestsService: UpdateHarvests
  ) {}

  async getPurchaseById(request: Request, response: Response): Promise<void> {
    const { id } = request.params;
    try {
      const purchase = await this.getPurchasesService.getPurchaseById(id);
      if (!purchase) {
        throw new PurchaseDoesNotExistError();
      }
      response.json(this.purchasesMapper.toDTO(purchase));
    } catch (error) {
      if (error instanceof DomainValidationError) {
        response.send(BadRequest(error.message));
      } else if (error instanceof PurchaseDoesNotExistError) {
        response.send(NotFound(error.message));
      } else {
        response.send(InternalServerError(error));
      }
    }
  }
  async getAllPurchases(request: Request, response: Response): Promise<void> {
    try {
      const purchases = await this.getPurchasesService.getAllPurchases();
      const purchaseDTOs = this.purchasesMapper.toDTOList(purchases);
      response.json(purchaseDTOs);
    } catch (error: any) {
      if (error instanceof DomainValidationError) {
        response.send(BadRequest(error.message));
      } else if (error instanceof PurchaseNotFoundError) {
        response.send(NotFound(error.message));
      } else {
        response.send(InternalServerError(error));
      }
    }
  }

  async getAllPurchasesByProvider(
    request: Request,
    response: Response
  ): Promise<void> {
    const { id } = request.params;
    const entity = "provider";
    try {
      const purchases = await this.getPurchasesService.getAllPurchasesById(
        id,
        entity
      );
      const purchaseDTOs = this.purchasesMapper.toDTOList(purchases);
      response.json(purchaseDTOs);
    } catch (error: any) {
      if (error instanceof DomainValidationError) {
        response.send(BadRequest(error.message));
      } else if (error instanceof PurchaseNotFoundError) {
        response.send(NotFound(error.message));
      } else {
        response.send(InternalServerError(error));
      }
    }
  }

  async createPurchase(request: Request, response: Response): Promise<void> {
    try {
      const purchases = await this.updatePurchasesService.createPurchase(
        request.body,
        request.auth.id
      );
      const PurchasesDTOs = this.purchasesMapper.toDTO(purchases!);
      response.json(PurchasesDTOs);
    } catch (error) {
      if (error instanceof PurchaseDetailsEnrollError) {
        response.send(Conflict(error.message));
      } else if (error instanceof InvalidAmountError) {
        response.send(Conflict(error.message));
      } else {
        response.send(InternalServerError(error));
      }
    }
  }

  async updatePurchase(request: Request, response: Response): Promise<void> {
    try {
      const result = await this.updatePurchasesService.updatePurchase(
        request.body,
        request.auth.id
      );
      response.send(result);
    } catch (error) {
      if (error instanceof DomainValidationError) {
        response.send(BadRequest(error.message));
      } else if (error instanceof PurchaseDoesNotExistError) {
        response.send(Conflict(error.message));
      } else {
        response.send(InternalServerError(error));
      }
    }
  }

  async deletePurchase(request: Request, response: Response): Promise<void> {
    const { id } = request.params;

    try {
      const result = await this.updatePurchasesService.deletePurchase(
        id,
        request.auth.id
      );
      response.send(result);
    } catch (error) {
      if (error instanceof DomainValidationError) {
        response.send(BadRequest(error.message));
      } else if (error instanceof PurchaseDoesNotExistError) {
        response.send(NotFound(error.message));
      } else if (error instanceof ProductDoesNotExistError) {
        response.send(NotFound(error.message));
      } else if (error instanceof InvalidAmountError) {
        response.send(Conflict(error.message));
      } else {
        response.send(InternalServerError(error));
      }
    }
  }

  async getHarvestById(request: Request, response: Response): Promise<void> {
    const { id } = request.params;
    try {
      const harvest = await this.getHarvestsService.getHarvestById(id);
      if (!harvest) {
        throw new HarvestDoesNotExistError();
      }
      response.json(this.harvestsMapper.toDTO(harvest));
    } catch (error) {
      if (error instanceof DomainValidationError) {
        response.send(BadRequest(error.message));
      } else if (error instanceof HarvestDoesNotExistError) {
        response.send(NotFound(error.message));
      } else {
        response.send(InternalServerError(error));
      }
    }
  }
  async getAllHarvests(request: Request, response: Response): Promise<void> {
    try {
      const harvests = await this.getHarvestsService.getAllHarvests();
      const harvestsDTOs = this.harvestsMapper.toDTOList(harvests);
      response.json(harvestsDTOs);
    } catch (error: any) {
      if (error instanceof DomainValidationError) {
        response.send(BadRequest(error.message));
      } else if (error instanceof HarvestNotFoundError) {
        response.send(NotFound(error.message));
      } else {
        response.send(InternalServerError(error));
      }
    }
  }

  async getAllHarvestsByCultivator(
    request: Request,
    response: Response
  ): Promise<void> {
    const { id } = request.params;
    const entity = "provider";
    try {
      const harvests = await this.getHarvestsService.getAllHarvestsById(
        id,
        entity
      );
      const harvestsDTOs = this.harvestsMapper.toDTOList(harvests);
      response.json(harvestsDTOs);
    } catch (error: any) {
      if (error instanceof DomainValidationError) {
        response.send(BadRequest(error.message));
      } else if (error instanceof HarvestNotFoundError) {
        response.send(NotFound(error.message));
      } else {
        response.send(InternalServerError(error));
      }
    }
  }

  async getAllHarvestsByVariety(
    request: Request,
    response: Response
  ): Promise<void> {
    const { id } = request.params;
    const entity = "variety";
    try {
      const harvests = await this.getHarvestsService.getAllHarvestsById(
        id,
        entity
      );
      const harvestsDTOs = this.harvestsMapper.toDTOList(harvests);
      response.json(harvestsDTOs);
    } catch (error: any) {
      if (error instanceof DomainValidationError) {
        response.send(BadRequest(error.message));
      } else if (error instanceof HarvestNotFoundError) {
        response.send(NotFound(error.message));
      } else {
        response.send(InternalServerError(error));
      }
    }
  }

  async createHarvest(request: Request, response: Response): Promise<void> {
    try {
      const harvest = await this.updateHarvestsService.createHarvest(
        request.body,
        request.auth.id
      );
      const harvestDTOs = this.harvestsMapper.toDTO(harvest!);
      response.json(harvestDTOs);
    } catch (error) {
      if (error instanceof InvalidAmountError) {
        response.send(Conflict(error.message));
      } else if (error instanceof MinZeroError) {
        response.send(Conflict(error.message));
      } else {
        response.send(InternalServerError(error));
      }
    }
  }

  async updateHarvestStock(
    request: Request,
    response: Response
  ): Promise<void> {
    try {
      const result = await this.updateHarvestsService.updateHarvestStock(
        request.body.harvest_id,
        request.body.stock,
        request.body.operation,
        request.auth.id
      );
      response.send(result);
    } catch (error) {
      if (error instanceof DomainValidationError) {
        response.send(BadRequest(error.message));
      } else if (error instanceof HarvestDoesNotExistError) {
        response.send(Conflict(error.message));
      } else if (error instanceof InvalidAmountError) {
        response.send(Conflict(error.message));
      } else if (error instanceof MinZeroError) {
        response.send(Conflict(error.message));
      } else {
        response.send(InternalServerError(error));
      }
    }
  }

  async updateHarvestManicured(
    request: Request,
    response: Response
  ): Promise<void> {
    try {
      const result = await this.updateHarvestsService.updateHarvestManicured(
        request.body.harvest_id,
        request.body.manicured,
        request.auth.id
      );
      response.send(result);
    } catch (error) {
      if (error instanceof DomainValidationError) {
        response.send(BadRequest(error.message));
      } else if (error instanceof HarvestDoesNotExistError) {
        response.send(Conflict(error.message));
      } else if (error instanceof InvalidAmountError) {
        response.send(Conflict(error.message));
      } else if (error instanceof MinZeroError) {
        response.send(Conflict(error.message));
      } else {
        response.send(InternalServerError(error));
      }
    }
  }

  async updateHarvestLoss(request: Request, response: Response): Promise<void> {
    try {
      const result = await this.updateHarvestsService.updateHarvestLoss(
        request.body.harvest_id,
        request.body.loss,
        request.body.operation,
        request.auth.id
      );
      response.send(result);
    } catch (error) {
      if (error instanceof DomainValidationError) {
        response.send(BadRequest(error.message));
      } else if (error instanceof HarvestDoesNotExistError) {
        response.send(Conflict(error.message));
      } else if (error instanceof InvalidAmountError) {
        response.send(Conflict(error.message));
      } else {
        response.send(InternalServerError(error));
      }
    }
  }

  async updateHarvestFee(request: Request, response: Response): Promise<void> {
    try {
      const result = await this.updateHarvestsService.updateHarvestFee(
        request.body.harvest_id,
        request.body.fee,
        request.auth.id
      );
      response.send(result);
    } catch (error) {
      if (error instanceof DomainValidationError) {
        response.send(BadRequest(error.message));
      } else if (error instanceof HarvestDoesNotExistError) {
        response.send(Conflict(error.message));
      } else if (error instanceof InvalidAmountError) {
        response.send(Conflict(error.message));
      } else if (error instanceof MinZeroError) {
        response.send(Conflict(error.message));
      } else {
        response.send(InternalServerError(error));
      }
    }
  }

  async deleteHarvest(request: Request, response: Response): Promise<void> {
    const { id } = request.params;

    try {
      const result = await this.updateHarvestsService.deleteHarvest(
        id,
        request.auth.id
      );
      response.send(result);
    } catch (error) {
      if (error instanceof DomainValidationError) {
        response.send(BadRequest(error.message));
      } else if (error instanceof HarvestDoesNotExistError) {
        response.send(NotFound(error.message));
      } else if (error instanceof ProductDoesNotExistError) {
        response.send(NotFound(error.message));
      } else if (error instanceof InvalidAmountError) {
        response.send(Conflict(error.message));
      } else {
        response.send(InternalServerError(error));
      }
    }
  }
}
