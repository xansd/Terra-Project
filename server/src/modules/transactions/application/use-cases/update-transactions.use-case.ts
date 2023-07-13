import Logger from "../../../../apps/utils/logger";
import { UpdatePartnerUseCase } from "../../../partners/application/use-cases/update-partner.use-case";
import { ITransactions, TransactionsTypes } from "../../domain/transactions";
import { TransactionDoesNotExistError } from "../../domain/transactions.exception";
import { ITransactionsRepository } from "../../domain/transactions.repository";
import {
  ITransactionsDTO,
  TransactionsMapper,
} from "../transactions-dto.mapper";

export interface IUpdateTransactions {
  create(transaction: ITransactionsDTO): Promise<ITransactions>;
  delete(id: string, user: string): Promise<void>;
}

export class UpdateTransactions implements IUpdateTransactions {
  private transactionMapper: TransactionsMapper = new TransactionsMapper();
  transactionDomain!: ITransactions;
  // private partnerUpdateService: UpdatePartnerUseCase;

  constructor(
    private readonly transactionsRepository: ITransactionsRepository
  ) // partnerUpdateService: UpdatePartnerUseCase
  {
    // this.partnerUpdateService = partnerUpdateService;
  }

  async create(transaction: ITransactionsDTO): Promise<ITransactions> {
    this.transactionDomain = this.transactionMapper.toDomain(transaction);
    const transactionRepository = await this.transactionsRepository.create(
      this.transactionDomain
    );
    return transactionRepository;
  }
  async delete(id: string, user: string): Promise<void> {
    const transaction = await this.transactionsRepository.getById(id);
    if (!transaction) {
      Logger.error(
        `mysql : getTransactionsById : TransactionDoesNotExistError`
      );
      throw new TransactionDoesNotExistError();
    }
    switch (Number(transaction?.transaction_type_id)) {
      case TransactionsTypes.INGRESO_CUOTA:
      case TransactionsTypes.INGRESO_INSCRIPCION:
        this.transactionsRepository.deleteFeeTransaction(
          transaction?.fee_id?.toString()!,
          transaction?.transaction_id?.value!,
          user
        );
        break;
      case TransactionsTypes.INGRESO_CUENTA_SOCIO:
        break;
      case TransactionsTypes.INGRESOS_DONACIONES:
      case TransactionsTypes.INGRESOS_PRESTAMOS:
        break;

      case TransactionsTypes.REINTEGRO_CUOTA:
      case TransactionsTypes.REINTEGRO_INSCRIPCION:
        break;
      case TransactionsTypes.REINTEGRO_CUENTA_SOCIO:
        break;
      case TransactionsTypes.GASTOS_ALQUILER:
      case TransactionsTypes.GASTOS_SERVICIOS:
      case TransactionsTypes.GASTOS_ACTIVIDADES_ASOCIACION:
      case TransactionsTypes.GASTOS_PRESTAMOS:
        break;

      default:
        break;
    }

    const result = await this.transactionsRepository.delete(id, user);
    return result;
  }
}
