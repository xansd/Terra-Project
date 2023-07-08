import { PaymentMapper } from "../../../modules/payments/application/payments-dto.mapper";
import { GetPayments } from "../../../modules/payments/application/use-cases/get-payments.use-cases";
import { UpdatePayments } from "../../../modules/payments/application/use-cases/update-payments.use-case";
import { Request, Response } from "express";
import {
  BadRequest,
  Conflict,
  InternalServerError,
  NotFound,
} from "../error/http-error";
import {
  PaymentCreationError,
  PaymentDoesNotExistError,
  PaymentLimitExceededError,
  PaymentNotFoundError,
} from "../../../modules/payments/domain/payments.exception";
import { DomainValidationError } from "../../../modules/shared/domain/domain-validation.exception";
import { InvalidAmountError } from "../../../modules/partners/domain/partner.exceptions";

export class PaymentsController {
  paymentMapper = new PaymentMapper();

  constructor(
    private readonly getPaymentsService: GetPayments,
    private readonly updatePaymentsService: UpdatePayments
  ) {}

  async getById(request: Request, response: Response): Promise<void> {
    const { id } = request.params;
    try {
      const payment = await this.getPaymentsService.getById(id);
      if (!payment) {
        throw new PaymentDoesNotExistError();
      }
      response.json(this.paymentMapper.toDTO(payment));
    } catch (error) {
      if (error instanceof DomainValidationError) {
        response.send(BadRequest(error.message));
      } else if (error instanceof PaymentDoesNotExistError) {
        response.send(NotFound(error.message));
      } else {
        response.send(InternalServerError(error));
      }
    }
  }
  async getAllByType(request: Request, response: Response): Promise<void> {
    try {
      const payments = await this.getPaymentsService.getAllByType(
        request.body.type
      );
      const paymentsDTOs = this.paymentMapper.toDTOList(payments);
      response.json(paymentsDTOs);
    } catch (error: any) {
      if (error instanceof DomainValidationError) {
        response.send(BadRequest(error.message));
      } else if (error instanceof PaymentNotFoundError) {
        response.send(NotFound(error.message));
      } else {
        response.send(InternalServerError(error));
      }
    }
  }

  async getAllByReference(request: Request, response: Response): Promise<void> {
    const { reference } = request.params;
    try {
      const payments = await this.getPaymentsService.getAllByReference(
        reference
      );
      const paymentsDTOs = this.paymentMapper.toDTOList(payments);
      response.json(paymentsDTOs);
    } catch (error: any) {
      if (error instanceof DomainValidationError) {
        response.send(BadRequest(error.message));
      } else if (error instanceof PaymentNotFoundError) {
        response.send(NotFound(error.message));
      } else {
        response.send(InternalServerError(error));
      }
    }
  }
  async create(request: Request, response: Response): Promise<void> {
    try {
      const payment = await this.updatePaymentsService.create(
        request.body,
        request.auth.id
      );
      const paymentDTOs = this.paymentMapper.toDTO(payment!);
      response.json(paymentDTOs);
    } catch (error) {
      if (error instanceof PaymentCreationError) {
        response.send(BadRequest(error.message));
      } else if (error instanceof PaymentLimitExceededError) {
        response.send(Conflict(error.message));
      } else if (error instanceof InvalidAmountError) {
        response.send(Conflict(error.message));
      } else response.send(InternalServerError(error));
    }
  }
  async delete(request: Request, response: Response): Promise<void> {
    const { id } = request.params;

    try {
      const result = await this.updatePaymentsService.delete(
        id,
        request.auth.id
      );
      response.send(result);
    } catch (error) {
      if (error instanceof DomainValidationError) {
        response.send(BadRequest(error.message));
      } else if (error instanceof PaymentDoesNotExistError) {
        response.send(NotFound(error.message));
      } else {
        response.send(InternalServerError(error));
      }
    }
  }
}
