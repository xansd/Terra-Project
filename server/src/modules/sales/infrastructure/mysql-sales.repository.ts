import { isNil } from "../../../../shared/type-checkers";
import Logger from "../../../apps/utils/logger";
import { MysqlDataBase } from "../../shared/infraestructure/mysql/mysql";
import { ISales, ISalesDetails } from "../domain/sales";
import {
  SaleDetailsEnrollError,
  SaleDoesNotExistError,
  SaleNotFoundError,
} from "../domain/sales.exception";
import { ISalesRepository } from "../domain/sales.repository";
import { SalesPersistenceMapper } from "./sales-persistence.mapper";

export class MySqlSalesRepository implements ISalesRepository {
  private salesPersistenceMapper: SalesPersistenceMapper =
    new SalesPersistenceMapper();

  async getById(id: string): Promise<ISales> {
    const rows = await MysqlDataBase.query(
      `SELECT * from sales WHERE sale_id = ? AND deleted_at IS NULL`,
      [id]
    );
    if (isNil(rows[0])) {
      Logger.error(`mysql : getSaleById : SaleDoesNotExistError`);
      throw new SaleDoesNotExistError();
    }

    return this.salesPersistenceMapper.toDomain(rows[0]) as ISales;
  }

  async getAllPartnerSales(id: string): Promise<ISales[]> {
    const query = `
      SELECT s.*, GROUP_CONCAT(
        JSON_OBJECT(
          'sale_detail_id', sd.sale_detail_id,
          'product_id', sd.product_id,
          'harvest_id', sd.harvest_id,
          'quantity', sd.quantity,
          'amount', sd.amount,
          'product_name', p.product_name,
          'product_code', p.code,
          'harvest_code', h.code
        )
      ) AS sale_details
      FROM sales s
      LEFT JOIN sale_details sd ON s.sale_id = sd.sale_id
      LEFT JOIN products p ON sd.product_id = p.product_id
      LEFT JOIN harvests h ON sd.harvest_id = h.harvest_id
      WHERE s.partner_id = ? AND s.deleted_at IS NULL
      GROUP BY s.sale_id
    `;
    const rows = await MysqlDataBase.query(query, [id]);

    if (rows.length === 0) {
      Logger.error(`mysql: getAll: SaleNotFoundError`);
      throw new SaleNotFoundError();
    }

    const sales: ISales[] = rows.map((row: any) => {
      const sale: ISales = {
        sale_id: row.sale_id,
        partner_id: row.partner_id,
        total_amount: row.total_amount,
        sale_details: JSON.parse(row.sale_details),
      };
      return sale;
    });

    return sales;
  }

  async getAll(): Promise<ISales[]> {
    const rows = await MysqlDataBase.query(
      `SELECT * FROM sales WHERE deleted_at IS NULL`
    );
    if (rows.length === 0) {
      Logger.error(`mysql : getAll : SaleNotFoundError`);
      throw new SaleNotFoundError();
    }
    return this.salesPersistenceMapper.toDomainList(rows) as ISales[];
  }
  async create(sale: ISales): Promise<ISales> {
    const salePersistence = this.salesPersistenceMapper.toPersistence(sale);
    const insertQuery = `INSERT INTO sales (sale_id, code, partner_id, total_amount,tax, notes,discount, user_created) VALUES (?,?,?,?,?,?,?,?)`;

    const insertResult = await MysqlDataBase.update(insertQuery, [
      salePersistence.sale_id,
      salePersistence.code!,
      salePersistence.partner_id!,
      salePersistence.total_amount?.toString()!,
      salePersistence.tax?.toString()!,
      salePersistence.notes!,
      salePersistence.discount?.toString()!,
      salePersistence.user_created!,
    ]);

    const saleId = salePersistence.sale_id;

    if (sale.sale_details && sale.sale_details.length > 0) {
      const purchaseDetailsInsertQuery = `INSERT INTO purchase_details (purchase_id, product_id, quantity) VALUES (?,?,?)`;

      for (const detail of sale.sale_details) {
        await MysqlDataBase.update(purchaseDetailsInsertQuery, [
          saleId,
          detail.product_id.toString(),
          detail.quantity.toString(),
        ]);
      }
    }

    const selectQuery = `SELECT * FROM sales ORDER BY created_at DESC LIMIT 1`;
    const selectResult = await MysqlDataBase.query(selectQuery);
    const lastSaleInserted = selectResult[0];

    Logger.info(`mysql : createSale: ${salePersistence.user_created}`);
    return this.salesPersistenceMapper.toDomain(lastSaleInserted);
  }

  async enrollSalesDetails(
    details: ISalesDetails[],
    saleId: string
  ): Promise<void> {
    let detail: any;
    let quantity: number;
    let amount: number;

    for (detail of details) {
      let product_id = detail.product_id;
      let harvest_id = detail.harvest_id;
      quantity = detail.quantity;
      amount = detail.amount;

      const insertQuery = `INSERT INTO sale_details (sale_id, product_id, harvest_id, quantity, amount) VALUES (?,?,?)`;
      const result = await MysqlDataBase.update(insertQuery, [
        saleId,
        product_id,
        harvest_id,
        quantity,
        amount,
      ]);
      if (result.affectedRows === 0) {
        Logger.error(`mysql : enrollSalesDetails : SaleDetailsEnrollError`);
        throw new SaleDetailsEnrollError();
      }
    }
  }

  async delete(id: string, user: string): Promise<void> {
    const result = await MysqlDataBase.update(
      `UPDATE sales SET deleted_at = NOW(), user_updated = ? WHERE sale_id = ?`,
      [user, id]
    );
    if (result.affectedRows === 0) {
      Logger.error(`mysql : delete : SaleDoesNotExistError`);
      throw new SaleDoesNotExistError();
    }
    Logger.info(`mysql : deleteSale ${user}`);
    return result;
  }
}
