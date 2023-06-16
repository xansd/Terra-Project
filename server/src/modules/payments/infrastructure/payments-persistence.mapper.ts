import { IPersistenceMapper } from "../../shared/infraestructure/persistence-mapper.interface";
import { IPayments, PaymentType } from "../domain/payments";

export interface IPaymentsPersistence {
  payment_id: string;
  type: PaymentType;
  reference_id: string;
  amount?: number;
  notes?: string;
  user_created?: string;
  user_updated?: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}

export class PaymentsPersistenceMapper
  implements IPersistenceMapper<IPayments, IPaymentsPersistence>
{
  constructor() {}
  toDomain(persistence: IPaymentsPersistence): IPayments {
    return {
      payment_id: persistence.payment_id,
      type: persistence.type,
      reference_id: persistence.reference_id,
      amount: persistence.amount,
      notes: persistence.notes,
      user_created: persistence.user_created,
      user_updated: persistence.user_updated,
      created_at: persistence.created_at,
      updated_at: persistence.updated_at,
      deleted_at: persistence.deleted_at,
    };
  }
  toPersistence(domain: IPayments): IPaymentsPersistence {
    const {
      payment_id,
      type,
      reference_id,
      amount,
      notes,
      user_created,
      user_updated,
      created_at,
      updated_at,
      deleted_at,
    } = domain;
    return {
      payment_id: payment_id,
      type: type,
      reference_id: reference_id,
      amount: amount,
      notes: notes,
      user_created: user_created,
      user_updated: user_updated,
      created_at: created_at,
      updated_at: updated_at,
      deleted_at: deleted_at,
    };
  }
  toPersistenceList(domainList: IPayments[]): IPaymentsPersistence[] {
    return domainList.map((payments) => this.toPersistence(payments));
  }
  toDomainList(persistenceList: IPaymentsPersistence[]): IPayments[] {
    return persistenceList.map((paymentsPersistence) =>
      this.toDomain(paymentsPersistence)
    );
  }
}
