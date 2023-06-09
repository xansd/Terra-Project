import { Request, Response } from "express";
import { CreatePartnerUseCase } from "../../../modules/partners/application/use-cases/create-partner.use-case";
import { DeletePartnerUseCase } from "../../../modules/partners/application/use-cases/delete-partner.use-case";
import { GetPartnerUseCase } from "../../../modules/partners/application/use-cases/get-partners.use-case";
import { ToggleActivePartnerUseCase } from "../../../modules/partners/application/use-cases/toggle-active-partner.use-case";
import { UpdatePartnerUseCase } from "../../../modules/partners/application/use-cases/update-partner.use-case";
import {
  BadRequest,
  NotFound,
  InternalServerError,
  Conflict,
} from "../error/http-error";
import { PartnerMapper } from "../../../modules/partners/application/partner-dto.mapper";
import { DomainValidationError } from "../../../modules/shared/domain/domain-validation.exception";
import {
  Number20Limit,
  PartnerAlreadyExistsError,
  PartnerDoesNotExistError,
  PartnersNotFoundError,
} from "../../../modules/partners/domain/partner.exceptions";
import { UserAlreadyExistsError } from "../../../modules/users/domain";
import { MysqlFilesRepository } from "../../../modules/files/infrastructure/mysql-files.repository";
import { FilesCaseUses } from "../../../modules/files/application/files.use-case";

export class PartnerController {
  partnerMapper = new PartnerMapper();
  constructor(
    private readonly createPartnerUseCase: CreatePartnerUseCase,
    private readonly getPartnersUseCase: GetPartnerUseCase,
    private readonly deletePartnerUseCase: DeletePartnerUseCase,
    private readonly toggleActivePartnerUserCase: ToggleActivePartnerUseCase,
    private readonly updatePartnerUseCase: UpdatePartnerUseCase
  ) {}

  async getById(request: Request, response: Response): Promise<void> {
    const { id } = request.params;
    try {
      const partner = await this.getPartnersUseCase.getPartner(id);
      response.json(this.partnerMapper.toDTO(partner));
    } catch (error) {
      if (error instanceof DomainValidationError) {
        response.send(BadRequest(error.message));
      } else if (error instanceof PartnerDoesNotExistError) {
        response.send(NotFound(error.message));
      } else {
        response.send(InternalServerError(error));
      }
    }
  }

  async getAll(request: Request, response: Response): Promise<void> {
    try {
      const partners = await this.getPartnersUseCase.getAllPartners();
      const partnersDTOs = this.partnerMapper.toDTOList(partners);
      response.json(partnersDTOs);
    } catch (error: any) {
      if (error instanceof DomainValidationError) {
        response.send(BadRequest(error.message));
      } else if (error instanceof PartnersNotFoundError) {
        response.send(NotFound(error.message));
      } else {
        response.send(InternalServerError(error));
      }
    }
  }

  async getAllFiltered(request: Request, response: Response): Promise<void> {
    try {
      const partners = await this.getPartnersUseCase.getAllPartnersFiltered();
      response.json(partners);
    } catch (error: any) {
      if (error instanceof DomainValidationError) {
        response.send(BadRequest(error.message));
      } else if (error instanceof PartnersNotFoundError) {
        response.send(NotFound(error.message));
      } else {
        response.send(InternalServerError(error));
      }
    }
  }

  async getTypes(request: Request, response: Response): Promise<void> {
    try {
      const types = await this.getPartnersUseCase.getTypes();
      response.json(types);
    } catch (error: any) {
      response.send(InternalServerError(error));
    }
  }

  async getLastNumber(request: Request, response: Response): Promise<void> {
    try {
      const number = await this.getPartnersUseCase.getPartnerLastNumber();
      response.json(number);
    } catch (error: any) {
      response.send(InternalServerError(error));
    }
  }

  async create(request: Request, response: Response): Promise<void> {
    try {
      const partner = await this.createPartnerUseCase.createPartner(
        request.body
      );
      const partnersDTOs = this.partnerMapper.toDTO(partner!);
      response.json(partnersDTOs);
    } catch (error) {
      if (error instanceof DomainValidationError) {
        response.send(BadRequest(error.message));
      } else if (error instanceof PartnerAlreadyExistsError) {
        response.send(Conflict(error.message));
      } else if (error instanceof UserAlreadyExistsError) {
        response.send(Conflict(error.message));
      } else if (error instanceof Number20Limit) {
        response.send(Conflict(error.message));
      } else {
        response.send(InternalServerError(error));
      }
    }
  }

  async update(request: Request, response: Response): Promise<void> {
    try {
      const result = await this.updatePartnerUseCase.updatePartner(
        request.body
      );
      response.send(result);
    } catch (error) {
      if (error instanceof DomainValidationError) {
        response.send(BadRequest(error.message));
      } else if (error instanceof PartnerDoesNotExistError) {
        response.send(NotFound(error.message));
      } else if (error instanceof PartnerAlreadyExistsError) {
        response.send(Conflict(error.message));
      } else {
        response.send(InternalServerError(error));
      }
    }
  }

  async delete(request: Request, response: Response): Promise<void> {
    const { id } = request.params;
    const filesRepository = new MysqlFilesRepository();
    const filesUseCase = new FilesCaseUses(filesRepository);

    try {
      filesUseCase.deleteFiles(id);
      const result = await this.deletePartnerUseCase.deletePartner(id);
      response.send(result);
    } catch (error) {
      if (error instanceof DomainValidationError) {
        response.send(BadRequest(error.message));
      } else if (error instanceof PartnerDoesNotExistError) {
        response.send(NotFound(error.message));
      } else {
        response.send(InternalServerError(error));
      }
    }
  }

  async makeActive(request: Request, response: Response): Promise<void> {
    const { id } = request.params;
    try {
      const result = await this.toggleActivePartnerUserCase.makeActive(id);
      response.send(result);
    } catch (error) {
      if (error instanceof DomainValidationError) {
        response.send(BadRequest(error.message));
      } else if (error instanceof PartnerDoesNotExistError) {
        response.send(NotFound(error.message));
      } else {
        response.send(InternalServerError(error));
      }
    }
  }

  async makeInactive(request: Request, response: Response): Promise<void> {
    const { id } = request.params;
    try {
      const result = await this.toggleActivePartnerUserCase.makeInactive(id);
      response.send(result);
    } catch (error) {
      if (error instanceof DomainValidationError) {
        response.send(BadRequest(error.message));
      } else if (error instanceof PartnerDoesNotExistError) {
        response.send(NotFound(error.message));
      } else {
        response.send(InternalServerError(error));
      }
    }
  }

  async partnerLeaves(request: Request, response: Response): Promise<void> {
    const { id } = request.params;
    try {
      const result = await this.toggleActivePartnerUserCase.partnerLeaves(id);
      response.send(result);
    } catch (error) {
      if (error instanceof DomainValidationError) {
        response.send(BadRequest(error.message));
      } else if (error instanceof PartnerDoesNotExistError) {
        response.send(NotFound(error.message));
      } else {
        response.send(InternalServerError(error));
      }
    }
  }

  async updateAccessCode(request: Request, response: Response): Promise<void> {
    const { id } = request.params;
    try {
      const result = await this.updatePartnerUseCase.updateAccessCode(
        request.body.access_code,
        id
      );
      response.send(result);
    } catch (error) {
      if (error instanceof DomainValidationError) {
        response.send(BadRequest(error.message));
      } else if (error instanceof PartnerDoesNotExistError) {
        response.send(NotFound(error.message));
      } else {
        response.send(InternalServerError(error));
      }
    }
  }

  async updatePartnerCash(request: Request, response: Response): Promise<void> {
    const { id } = request.params;
    try {
      const result = await this.updatePartnerUseCase.updatePartnerCash(
        request.body.amount,
        id
      );
      response.send(result);
    } catch (error) {
      if (error instanceof DomainValidationError) {
        response.send(BadRequest(error.message));
      } else if (error instanceof PartnerDoesNotExistError) {
        response.send(NotFound(error.message));
      } else {
        response.send(InternalServerError(error));
      }
    }
  }
}
