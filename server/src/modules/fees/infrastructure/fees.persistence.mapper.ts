import { IPersistenceMapper } from "../../shared/infraestructure/persistence-mapper.interface";
import { IFeesDTO } from "../application/fees.mapper";
import { Fees, IFees } from "../domain/fees";

export interface IFeesPersistence {
  fee_id?: number;
  partner_id?: string;
  fees_type_id: number;
  expiration?: string;
  paid?: number | boolean;
  payment_transaction_id?: string;
  user_created?: string;
  user_updated?: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}

export class FeesPersistenceMapper
  implements IPersistenceMapper<IFees, IFeesPersistence>
{
  toDomain(persistence: IFeesPersistence): IFees {
    return Fees.create({
      fee_id: persistence.fee_id,
      partner_id: persistence.partner_id,
      fees_type_id: persistence.fees_type_id,
      expiration: persistence.expiration,
      paid: persistence.paid,
      payment_transaction_id: persistence.payment_transaction_id,
      user_created: persistence.user_created,
      user_updated: persistence.user_updated,
      created_at: persistence.created_at,
      updated_at: persistence.updated_at,
      deleted_at: persistence.deleted_at,
    });
  }
  toPersistence(domain: IFees): IFeesPersistence {
    return {
      fee_id: domain.fee_id,
      partner_id: domain.partner_id,
      expiration: domain.expiration!,
      fees_type_id: domain.fees_type_id,
      paid: domain.paid,
      payment_transaction_id: domain.payment_transaction_id,
      user_created: domain.user_created,
      user_updated: domain.user_updated,
      created_at: domain.created_at,
      updated_at: domain.updated_at,
      deleted_at: domain.deleted_at,
    };
  }
  toPersistenceList(domainList: IFeesDTO[]): IFeesPersistence[] {
    return domainList.map((fee) => this.toPersistence(fee));
  }

  toDomainList(persistenceList: IFeesPersistence[]): IFees[] {
    return persistenceList.map((feePersistence) =>
      this.toDomain(feePersistence)
    );
  }
}
