import { isNil } from "../../../../shared/type-checkers";
import Logger from "../../../apps/utils/logger";
import { MysqlDataBase } from "../../shared/infraestructure/mysql/mysql";
import { IHarvests } from "../domain/harvests";
import { IPurchase } from "../domain/purchases";
import {
  HarvestNotFoundError,
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

  async getPurchaseById(id: string): Promise<IPurchase | null> {
    const rows = await MysqlDataBase.query(
      `SELECT purchases.*, providers.name AS provider_name
        FROM purchases
        INNER JOIN providers ON purchases.provider_id = providers.provider_id
        WHERE purchases.purchase_id = ? AND purchases.deleted_at IS NULL`,
      [id]
    );

    if (isNil(rows[0])) {
      Logger.error(`mysql : getPurchaseById : PurchaseDoesNotExistError`);
      return null;
    }

    const purchase = this.purchasesPersistenceMapper.toDomain(
      rows[0]
    ) as IPurchase;

    const purchaseDetailsRows = await MysqlDataBase.query(
      `SELECT pd.*, products.name AS product_name
        FROM purchase_details pd
        INNER JOIN products ON pd.product_id = products.product_id
        WHERE pd.purchase_id = ?`,
      [id]
    );

    const purchaseDetails = purchaseDetailsRows.map((row: any) => {
      return {
        purchase_detail_id: row.purchase_detail_id,
        purchase_id: row.purchase_id,
        product_id: row.product_id,
        product_name: row.product_name,
        quantity: row.quantity,
        amount: row.amount,
        lot: row.lot,
      };
    });

    purchase.provider_name = rows[0].provider_name;
    purchase.purchase_details = purchaseDetails;

    return purchase;
  }

  async getAllPurchases(): Promise<IPurchase[]> {
    const rows = await MysqlDataBase.query(
      `SELECT p.*, pr.name AS provider_name, SUM(pm.amount) AS paid
      FROM purchases p
      LEFT JOIN providers pr ON p.provider_id = pr.provider_id
      LEFT JOIN payments pm ON pm.reference_id = p.purchase_id AND pm.type = 'PAGO'
      WHERE p.deleted_at IS NULL AND pm.deleted_at IS NULL
      GROUP BY p.purchase_id`
    );

    if (rows.length === 0) {
      Logger.error(`mysql : getAll : PurchaseNotFoundError`);
      throw new PurchaseNotFoundError();
    }

    return this.purchasesPersistenceMapper.toDomainList(rows) as IPurchase[];
  }

  async getAllPurchasesById(id: string, entity: string): Promise<IPurchase[]> {
    let query = `SELECT * FROM purchases WHERE deleted_at IS NULL`;
    let params: any[] = [];

    if (entity === "provider") {
      query += ` AND provider_id = ?`;
      params.push(id);
    }

    const rows = await MysqlDataBase.query(query, params);

    if (rows.length === 0) {
      Logger.error(`mysql: getAll: PurchaseNotFoundError`);
      throw new PurchaseNotFoundError();
    }

    return this.purchasesPersistenceMapper.toDomainList(rows) as IPurchase[];
  }

  async createPurchase(purchase: IPurchase, user: string): Promise<IPurchase> {
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
        user,
      ]);

      const purchaseId = purchasePersistence.purchase_id;

      if (purchase.purchase_details && purchase.purchase_details.length > 0) {
        const purchaseDetailsInsertQuery = `INSERT INTO purchase_details (purchase_id, product_id, quantity, amount, lot) VALUES (?,?,?,?,?)`;

        for (const detail of purchase.purchase_details) {
          await MysqlDataBase.update(purchaseDetailsInsertQuery, [
            purchaseId,
            detail.product_id.toString(),
            detail.quantity.toString(),
            detail.amount.toString(),
            detail.lot!.toString()!,
          ]);
        }
      }

      const selectQuery = `SELECT * FROM purchases WHERE purchase_id = ?`;
      const selectResult = await MysqlDataBase.query(selectQuery, [purchaseId]);
      const lastPurchaseInserted = selectResult[0];

      Logger.info(`mysql : createPurchase : ${user}`);
      return this.purchasesPersistenceMapper.toDomain(lastPurchaseInserted);
    } catch (error) {
      Logger.error(`mysql : createPurchase : ${error}`);
      throw new Error("" + error);
    }
  }

  async updatePurchase(purchase: IPurchase, user: string): Promise<void> {
    const purchasePersistence =
      this.purchasesPersistenceMapper.toPersistence(purchase);
    const updateQuery = `UPDATE purchases SET code=?, provider_id=?, total_amount=?, notes=?, user_updated=? WHERE purchase_id = ?`;

    try {
      await MysqlDataBase.update(updateQuery, [
        purchasePersistence.code!,
        purchasePersistence.provider_id!,
        purchasePersistence.total_amount?.toString()!,
        purchasePersistence.notes!,
        user,
        purchasePersistence.purchase_id,
      ]);

      const purchaseId = purchasePersistence.purchase_id;

      if (purchase.purchase_details && purchase.purchase_details.length > 0) {
        const deleteQuery = `DELETE FROM purchase_details WHERE purchase_id=?`;
        await MysqlDataBase.update(deleteQuery, [purchaseId]);

        const purchaseDetailsInsertQuery = `INSERT INTO purchase_details purchase_id, product_id, quantity, amount, lot) VALUES (?,?,?,?,?)`;

        for (const detail of purchase.purchase_details) {
          await MysqlDataBase.update(purchaseDetailsInsertQuery, [
            purchaseId,
            detail.product_id.toString(),
            detail.quantity.toString(),
            detail.amount.toString(),
            detail.lot!.toString()!,
          ]);
        }
        Logger.info(`mysql : updatePurchase : ${user}`);
      }
    } catch (error) {
      Logger.error(`mysql : updatePurchase : ${error}`);
      throw new Error("" + error);
    }
  }

  async deletePurchase(id: string, user: string): Promise<void> {
    const result = await MysqlDataBase.update(
      `UPDATE purchases SET deleted_at = NOW(), user_updated = ? WHERE purchase_id = ?`,
      [user, id]
    );
    if (result.affectedRows === 0) {
      Logger.error(`mysql : delete : PurchaseDoesNotExistError`);
      throw new PurchaseDoesNotExistError();
    }
    Logger.info(`mysql : deletePurchase : ${user}`);
    return result;
  }

  // async enrollPurchaseDetails(
  //   details: IPurchaseDetails[],
  //   purchaseId: string
  // ): Promise<void> {
  //   let detail: any;
  //   let quantity: number;

  //   for (detail of details) {
  //     let product_id = detail.product_id;
  //     quantity = detail.quantity;

  //     const insertQuery = `INSERT INTO purchase_details purchase_id, product_id, quantity, amount, lot) VALUES (?,?,?,?,?)`;
  //     const result = await MysqlDataBase.update(insertQuery, [
  //       purchaseId,
  //       product_id,
  //       quantity,
  //     ]);
  //     if (result.affectedRows === 0) {
  //       Logger.error(
  //         `mysql : enrollPurchaseDetails : PurchaseDetailsEnrollError`
  //       );
  //       throw new PurchaseDetailsEnrollError();
  //     }
  //   }
  // }

  /*******************************************HARVESTS*********************************************/
  async getHarvestById(id: string): Promise<IHarvests | null> {
    const rows = await MysqlDataBase.query(
      `SELECT h.*, p.name AS product_name, pr.name AS provider_name
      FROM harvests h
      INNER JOIN products p ON h.product_id = p.product_id
      INNER JOIN providers pr ON h.provider_id = pr.provider_id
      WHERE h.harvest_id = ? AND h.deleted_at IS NULL`,
      [id]
    );
    if (isNil(rows[0])) {
      Logger.error(`mysql: getHarvestById: HarvestDoesNotExistError`);
      return null;
    }
    return this.harvestsPersistenceMapper.toDomain(rows[0]) as IHarvests;
  }

  async getAllHarvests(): Promise<IHarvests[]> {
    const rows = await MysqlDataBase.query(
      `SELECT h.*, p.name AS product_name, pr.name AS provider_name, SUM(pm.amount) AS paid
      FROM harvests h
      INNER JOIN products p ON h.product_id = p.product_id
      INNER JOIN providers pr ON h.provider_id = pr.provider_id
      LEFT JOIN payments pm ON pm.reference_id = h.harvest_id AND pm.type = 'PAGO'
      WHERE h.deleted_at IS NULL
      GROUP BY h.harvest_id`
    );
    if (rows.length === 0) {
      Logger.error(`mysql: getAll: HarvestNotFoundError`);
      throw new HarvestNotFoundError();
    }
    return this.harvestsPersistenceMapper.toDomainList(rows) as IHarvests[];
  }

  async getAllHarvestsById(id: string, type: string): Promise<IHarvests[]> {
    let query = `SELECT * FROM harvests WHERE deleted_at IS NULL`;
    let params: any[] = [];

    if (type === "variety") {
      query += ` AND product_id = ?`;
      params.push(id);
    } else if (type === "cultivator") {
      query += ` AND provider_id = ?`;
      params.push(id);
    }

    const rows = await MysqlDataBase.query(query, params);

    if (rows.length === 0) {
      Logger.error(`mysql: getAll: HarvestNotFoundError`);
      throw new HarvestNotFoundError();
    }

    return this.harvestsPersistenceMapper.toDomainList(rows) as IHarvests[];
  }

  async createHarvest(harvest: IHarvests, user: string): Promise<IHarvests> {
    const harvestPersistence =
      this.harvestsPersistenceMapper.toPersistence(harvest);
    const insertQuery = `INSERT INTO harvests (harvest_id, code, product_id, provider_id, cost_price, fee_amount,quantity,notes,  stock,user_created) VALUES (?,?,?,?,?,?,?,?,?,?)`;

    const selectQuery = `SELECT * FROM harvests ORDER BY created_at DESC LIMIT 1`;
    const insertResult = await MysqlDataBase.update(insertQuery, [
      harvestPersistence.harvest_id,
      harvestPersistence.code!,
      harvestPersistence.product_id.toString()!,
      harvestPersistence.provider_id.toString()!,
      harvestPersistence.cost_price?.toString()!,
      harvestPersistence.fee_amount?.toString()!,
      harvestPersistence.quantity?.toString()!,
      harvestPersistence.notes!,
      // harvestPersistence.manicured?.toString()!,
      harvestPersistence.stock?.toString()!,
      user,
    ]);
    const selectResult = await MysqlDataBase.query(selectQuery);
    const lastHarverstInserted = selectResult[0];

    Logger.info(`mysql : createHarvest : ${user}`);
    return this.harvestsPersistenceMapper.toDomain(lastHarverstInserted);
  }

  async getHarvestStock(harvestId: string): Promise<boolean> {
    const stock = await MysqlDataBase.query(
      `SELECT stock FROM harvests WHERE harvest_id = ?`,
      [harvestId]
    );
    return stock[0];
  }

  async updateHarvestStock(
    harvestId: string,
    stock: number,
    user: string
  ): Promise<void> {
    const result = await MysqlDataBase.update(
      `UPDATE harvests SET stock = ?, user_updated = ? WHERE harvest_id = ?`,
      [stock.toString(), user, harvestId]
    );
    if (result.affectedRows === 0) {
      Logger.error(`mysql : updateHarvestStock : HarvestNotFoundError`);
      throw new HarvestNotFoundError();
    }
    Logger.info(`mysql : updateHarvestStock : ${user}`);
    return result;
  }

  async updateHarvestLoss(
    harvestId: string,
    loss: number,
    user: string
  ): Promise<void> {
    const result = await MysqlDataBase.update(
      `UPDATE harvests SET loss = ?, user_updated = ? WHERE harvest_id = ?`,
      [loss.toString(), user, harvestId]
    );
    if (result.affectedRows === 0) {
      Logger.error(`mysql : updateHarvestLoss : HarvestNotFoundError`);
      throw new HarvestNotFoundError();
    }
    Logger.info(`mysql : updateHarvestLoss : ${user}`);
    return result;
  }

  async updateHarvestManicured(
    harvestId: string,
    manicured: number,
    user: string
  ): Promise<void> {
    const result = await MysqlDataBase.update(
      `UPDATE harvests SET manicured = ?, user_updated = ? WHERE harvest_id = ?`,
      [manicured.toString(), user, harvestId]
    );
    if (result.affectedRows === 0) {
      Logger.error(`mysql : updateHarvestManicured : HarvestNotFoundError`);
      throw new HarvestNotFoundError();
    }
    Logger.info(`mysql : updateHarvestManicured : ${user}`);
    return result;
  }

  async updateHarvestFee(
    harvestId: string,
    fee: number,
    user: string
  ): Promise<void> {
    const result = await MysqlDataBase.update(
      `UPDATE harvests SET fee_amount = ?, user_updated = ? WHERE harvest_id = ?`,
      [fee.toString(), user, harvestId]
    );
    if (result.affectedRows === 0) {
      Logger.error(`mysql : updateHarvestFee : HarvestNotFoundError`);
      throw new HarvestNotFoundError();
    }
    Logger.info(`mysql : updateHarvestFee : ${user}`);
    return result;
  }

  async deleteHarvest(id: string, user: string): Promise<void> {
    const result = await MysqlDataBase.update(
      `UPDATE harvests SET deleted_at = NOW(), user_updated = ? WHERE harvest_id = ?`,
      [user, id]
    );
    if (result.affectedRows === 0) {
      Logger.error(`mysql : delete : HarvestNotFoundError`);
      throw new HarvestNotFoundError();
    }
    Logger.info(`mysql : deleteHarvest : ${user}`);
    return result;
  }
  /*******************************************HARVESTS*********************************************/
}
