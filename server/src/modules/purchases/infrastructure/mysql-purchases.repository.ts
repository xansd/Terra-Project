import { isNil } from "../../../../shared/type-checkers";
import Logger from "../../../apps/utils/logger";
import { MysqlDataBase } from "../../shared/infraestructure/mysql/mysql";
import { IHarvests } from "../domain/harvests";
import { IPurchase, IPurchaseDetails } from "../domain/purchases";
import {
  HarvestDoesNotExistError,
  HarvestNotFoundError,
  PurchaseDetailsEnrollError,
  PurchaseDoesNotExistError,
  PurchaseNotFoundError,
} from "../domain/purchases.exception";
import { IPurchasesRepository } from "../domain/purchases.repository";
import { HarvestsPersistenceMapper } from "./harvests-persistence.mapper";
import { PurchasePersistenceMapper } from "./purchases-persistence.mapper";

export class MySqlPurchasesRepository implements IPurchasesRepository {
  private purchasesPersistenceMapper: PurchasePersistenceMapper =
    new PurchasePersistenceMapper();

  private harvestsPersistenceMapper: HarvestsPersistenceMapper =
    new HarvestsPersistenceMapper();

  async getPurchaseById(id: string): Promise<IPurchase> {
    const rows = await MysqlDataBase.query(
      `SELECT * from purchases WHERE purchases_id = ? AND deleted_at IS NULL`,
      [id]
    );
    if (isNil(rows[0])) {
      Logger.error(`mysql : getPurchaseById : PurchaseDoesNotExistError`);
      throw new PurchaseDoesNotExistError();
    }

    return this.purchasesPersistenceMapper.toDomain(rows[0]) as IPurchase;
  }
  async getAllPurchases(): Promise<IPurchase[]> {
    const rows = await MysqlDataBase.query(
      `SELECT * FROM purchases WHERE deleted_at IS NULL`
    );
    if (rows.length === 0) {
      Logger.error(`mysql : getAll : PurchaseNotFoundError`);
      throw new PurchaseNotFoundError();
    }
    return this.purchasesPersistenceMapper.toDomainList(rows) as IPurchase[];
  }
  async createPurchase(purchase: IPurchase): Promise<IPurchase> {
    const purchasePersistence =
      this.purchasesPersistenceMapper.toPersistence(purchase);
    const insertQuery = `INSERT INTO purchases (purchase_id, code, provider_id, total_amount, notes, user_created) VALUES (?,?,?,?,?,?)`;

    try {
      await MysqlDataBase.update(insertQuery, [
        purchasePersistence.purchase_id,
        purchasePersistence.code!,
        purchasePersistence.provider_id!,
        purchasePersistence.total_amount?.toString()!,
        purchasePersistence.notes!,
        purchasePersistence.user_created!,
      ]);

      const purchaseId = purchasePersistence.purchase_id;

      if (purchase.purchase_details && purchase.purchase_details.length > 0) {
        const purchaseDetailsInsertQuery = `INSERT INTO purchase_details (purchase_id, product_id, quantity) VALUES (?,?,?)`;

        for (const detail of purchase.purchase_details) {
          await MysqlDataBase.update(purchaseDetailsInsertQuery, [
            purchaseId,
            detail.product_id.toString(),
            detail.quantity.toString(),
          ]);
        }
      }

      const selectQuery = `SELECT * FROM purchases WHERE purchase_id = ?`;
      const selectResult = await MysqlDataBase.query(selectQuery, [purchaseId]);
      const lastPurchaseInserted = selectResult[0];

      return this.purchasesPersistenceMapper.toDomain(lastPurchaseInserted);
    } catch (error) {
      Logger.error(`mysql : createPurchase : ${error}`);
      throw new Error("" + error);
    }
  }

  async updatePurchase(purchase: IPurchase): Promise<void> {
    const purchasePersistence =
      this.purchasesPersistenceMapper.toPersistence(purchase);
    const updateQuery = `UPDATE purchases SET code=?, provider_id=?, total_amount=?, notes=?, user_updated=? WHERE purchase_id=?`;

    try {
      await MysqlDataBase.update(updateQuery, [
        purchasePersistence.code!,
        purchasePersistence.provider_id!,
        purchasePersistence.total_amount?.toString()!,
        purchasePersistence.notes!,
        purchasePersistence.user_updated!,
        purchasePersistence.purchase_id,
      ]);

      const purchaseId = purchasePersistence.purchase_id;

      if (purchase.purchase_details && purchase.purchase_details.length > 0) {
        const deleteQuery = `DELETE FROM purchase_details WHERE purchase_id=?`;
        await MysqlDataBase.update(deleteQuery, [purchaseId]);

        const purchaseDetailsInsertQuery = `INSERT INTO purchase_details (purchase_id, product_id, quantity) VALUES (?,?,?)`;

        for (const detail of purchase.purchase_details) {
          await MysqlDataBase.update(purchaseDetailsInsertQuery, [
            purchaseId,
            detail.product_id.toString(),
            detail.quantity.toString(),
          ]);
        }
      }
    } catch (error) {
      Logger.error(`mysql : updatePurchase : ${error}`);
      throw new Error("" + error);
    }
  }

  async deletePurchase(id: string): Promise<void> {
    const result = await MysqlDataBase.update(
      `UPDATE purchases SET deleted_at = NOW() WHERE purchase_id = ?`,
      [id]
    );
    if (result.affectedRows === 0) {
      Logger.error(`mysql : delete : PurchaseDoesNotExistError`);
      throw new PurchaseDoesNotExistError();
    }
    return result;
  }

  async enrollPurchaseDetails(
    details: IPurchaseDetails[],
    purchaseId: string
  ): Promise<void> {
    let detail: any;
    let quantity: number;

    for (detail of details) {
      let product_id = detail.product_id;
      quantity = detail.quantity;

      const insertQuery = `INSERT INTO purchase_details (purchase_id, product_id, quantity) VALUES (?,?,?)`;
      const result = await MysqlDataBase.update(insertQuery, [
        purchaseId,
        product_id,
        quantity,
      ]);
      if (result.affectedRows === 0) {
        Logger.error(
          `mysql : enrollPurchaseDetails : PurchaseDetailsEnrollError`
        );
        throw new PurchaseDetailsEnrollError();
      }
    }
  }

  /*******************************************HARVESTS*********************************************/
  async getHarvestById(id: string): Promise<IHarvests> {
    const rows = await MysqlDataBase.query(
      `SELECT * from harvests WHERE purchases_id = ? AND deleted_at IS NULL`,
      [id]
    );
    if (isNil(rows[0])) {
      Logger.error(`mysql : getHarvestById : HarvestDoesNotExistError`);
      throw new HarvestDoesNotExistError();
    }
    return this.harvestsPersistenceMapper.toDomain(rows[0]) as IHarvests;
  }
  async getAllHarvests(): Promise<IHarvests[]> {
    const rows = await MysqlDataBase.query(
      `SELECT * FROM harvests WHERE deleted_at IS NULL`
    );
    if (rows.length === 0) {
      Logger.error(`mysql : getAll : HarvestNotFoundError`);
      throw new HarvestNotFoundError();
    }
    return this.harvestsPersistenceMapper.toDomainList(rows) as IHarvests[];
  }
  async createHarvest(harvest: IHarvests): Promise<IHarvests> {
    const harvestPersistence =
      this.harvestsPersistenceMapper.toPersistence(harvest);
    const insertQuery = `INSERT INTO harvests (harvest_id, code, product_id, provider_id, cost_price, fee_amount,quantity,notes,user_created) VALUES (?,?,?,?,?,?,?,?,?)`;

    const selectQuery = `SELECT * FROM purchases ORDER BY created_at DESC LIMIT 1`;
    const insertResult = await MysqlDataBase.update(insertQuery, [
      harvestPersistence.harvest_id,
      harvestPersistence.code!,
      harvestPersistence.product_id.toString()!,
      harvestPersistence.provider_id.toString()!,
      harvestPersistence.cost_price?.toString()!,
      harvestPersistence.fee_amount?.toString()!,
      harvestPersistence.quantity?.toString()!,
      harvestPersistence.notes!,
      harvestPersistence.user_created!,
    ]);
    const selectResult = await MysqlDataBase.query(selectQuery);
    const lastHarverstInserted = selectResult[0];

    return this.harvestsPersistenceMapper.toDomain(lastHarverstInserted);
  }

  async updateHarvest(harvest: IHarvests): Promise<void> {
    const harvestPersistence =
      this.harvestsPersistenceMapper.toPersistence(harvest);
    const result = await MysqlDataBase.update(
      `UPDATE harvests SET product_id = ?, provider_id = ?, cost_price = ?, sale_price = ?, fee_amount = ?, quantity = ?, notes = ? WHERE harvest_id = ?`,
      [
        harvestPersistence.product_id,
        harvestPersistence.provider_id,
        harvestPersistence.cost_price?.toString()!,
        harvestPersistence.sale_price?.toString()!,
        harvestPersistence.fee_amount?.toString()!,
        harvestPersistence.quantity?.toString()!,
        harvestPersistence.notes!,
        harvestPersistence.harvest_id,
      ]
    );
    if (result.affectedRows === 0) {
      Logger.error(`mysql : delete : HarvestNotFoundError`);
      throw new HarvestNotFoundError();
    }
    return result;
  }

  async deleteHarvest(id: string): Promise<void> {
    const result = await MysqlDataBase.update(
      `UPDATE harvests SET deleted_at = NOW() WHERE harvest_id = ?`,
      [id]
    );
    if (result.affectedRows === 0) {
      Logger.error(`mysql : delete : HarvestNotFoundError`);
      throw new HarvestNotFoundError();
    }
    return result;
  }
  /*******************************************HARVESTS*********************************************/
}
