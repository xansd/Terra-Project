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
  PartnerAlreadyExistsError,
  PartnerDoesNotExistError,
  PartnersNotFoundError,
} from "../../../modules/partners/domain/partner.exceptions";
import { ManagePartnersDocumentationUseCase } from "../../../modules/partners/application/use-cases/manage-partners-documentd.use-case";

export class PartnerController {
  partnerMapper = new PartnerMapper();
  constructor(
    private readonly createPartnerUseCase: CreatePartnerUseCase,
    private readonly getPartnersUseCase: GetPartnerUseCase,
    private readonly deletePartnerUseCase: DeletePartnerUseCase,
    private readonly toggleActivePartnerUserCase: ToggleActivePartnerUseCase,
    private readonly updatePartnerUseCase: UpdatePartnerUseCase,
    private readonly managePartnerDocumentationUseCase: ManagePartnersDocumentationUseCase
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
      response.json(this.partnerMapper.toDTOList(partners));
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
      } else {
        response.send(InternalServerError(error));
      }
    }
  }

  async update(request: Request, response: Response): Promise<void> {
    try {
      const partner = await this.updatePartnerUseCase.updatePartner(
        request.body
      );
      const partnersDTOs = this.partnerMapper.toDTO(partner!);
      response.json(partnersDTOs);
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

  async delete(request: Request, response: Response): Promise<void> {
    const { id } = request.params;

    try {
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

  async uploadDocument(request: Request, response: Response): Promise<void> {}
  async getDocument(request: Request, response: Response): Promise<void> {}
  async getAllDocuments(request: Request, response: Response): Promise<void> {}
  async deleteDocument(request: Request, response: Response): Promise<void> {}
}
