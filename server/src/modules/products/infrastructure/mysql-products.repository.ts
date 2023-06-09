import { isNil } from "../../../../shared/type-checkers";
import Logger from "../../../apps/utils/logger";
import { MysqlDataBase } from "../../shared/infraestructure/mysql/mysql";
import { IProductSubsetDTO } from "../application/products-dto.mapper";
import {
  ICategories,
  IProduct,
  ISubcategories,
  ProductsType,
} from "../domain/products";
import {
  AncestorEnrollError,
  ProductDoesNotExistError,
  ProductNotFoundError,
  SubCategoryCreationError,
  SubCategoryDoesNotExistError,
  SubCategoryEnrollError,
} from "../domain/products.exception";
import { IProductRepository } from "../domain/products.repository";
import { ProductPersistenceMapper } from "./products-persistence.mapper";

export class MySQLProductRepository implements IProductRepository {
  /*************************************PRODUCTS***************************************/
  private productPersistenceMapper: ProductPersistenceMapper =
    new ProductPersistenceMapper();
  async getById(productId: string): Promise<IProduct> {
    const rows = await MysqlDataBase.query(
      `
    SELECT products.*,
    GROUP_CONCAT(DISTINCT ps.subcategory_id) AS subcategories,
    GROUP_CONCAT(DISTINCT a.ancestor_id) AS ancestors
    FROM products
    LEFT JOIN product_subcategory ps ON products.product_id = ps.product_id
    LEFT JOIN ancestors a ON products.product_id = a.product_id
    WHERE products.product_id = ? AND deleted_at IS NULL
    GROUP BY products.product_id;
    `,
      [productId]
    );
    if (isNil(rows[0])) {
      Logger.error(`mysql : getById : ProductDoesNotExistError`);
      throw new ProductDoesNotExistError();
    }

    return this.productPersistenceMapper.toDomain(rows[0]) as IProduct;
  }
  async getAll(): Promise<IProduct[]> {
    const rows = await MysqlDataBase.query(
      `
      SELECT products.*,
      GROUP_CONCAT(DISTINCT ps.subcategory_id) AS subcategories,
      GROUP_CONCAT(DISTINCT a.ancestor_id) AS ancestors
      FROM products
      LEFT JOIN product_subcategory ps ON products.product_id = ps.product_id
      LEFT JOIN ancestors a ON products.product_id = a.product_id
      WHERE  deleted_at IS NULL
      GROUP BY products.product_id;
      `
    );
    if (rows.length === 0) {
      Logger.error(`mysql : getAll : ProductNotFoundError`);
      throw new ProductNotFoundError();
    }
    return this.productPersistenceMapper.toDomainList(rows) as IProduct[];
  }
  async getAllFiltered(): Promise<IProductSubsetDTO[]> {
    const rows = await MysqlDataBase.query(
      `SELECT product_id, code, name FROM products where deleted_at IS NULL`
    );
    return this.productPersistenceMapper.toDtoFilteredList(
      rows
    ) as unknown as IProductSubsetDTO[];
  }

  async create(product: IProduct): Promise<IProduct> {
    const productPersistenceMapper =
      this.productPersistenceMapper.toPersistence(product);
    const insertQuery = `INSERT INTO products (product_id, code, name, type, category_id, description, cost_price, sale_price, sativa, indica, thc, cbd, bank, flawour, effect, user_created)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const selectQuery = `SELECT * FROM products WHERE product_id = ?`;

    const values: any[] = [
      productPersistenceMapper.product_id!,
      productPersistenceMapper.code!,
      productPersistenceMapper.name!,
      productPersistenceMapper.type,
      productPersistenceMapper.category_id,
      productPersistenceMapper.description!,
      null, // cost_price (conditional)
      null, // sale_price (conditional)
      null, // sativa (conditional)
      null, // indica (conditional)
      null, // thc (conditional)
      null, // cbd (conditional)
      null, // bank (conditional)
      null, // flawour (conditional)
      null, // effect (conditional)
      productPersistenceMapper.user_created!,
    ];

    if (productPersistenceMapper.type === ProductsType.TERCEROS) {
      values[6] = productPersistenceMapper.cost_price?.toString()!;
      values[7] = productPersistenceMapper.sale_price?.toString()!;
    } else if (productPersistenceMapper.type === ProductsType.MANCOMUNADOS) {
      values[8] = productPersistenceMapper.sativa?.toString()!;
      values[9] = productPersistenceMapper.indica?.toString()!;
      values[10] = productPersistenceMapper.thc?.toString()!;
      values[11] = productPersistenceMapper.cbd?.toString()!;
      values[12] = productPersistenceMapper.bank!;
      values[13] = productPersistenceMapper.flawour!;
      values[14] = productPersistenceMapper.effect!;
    }

    await MysqlDataBase.update(insertQuery, values);
    const selectResult = await MysqlDataBase.query(selectQuery, [
      productPersistenceMapper.product_id!,
    ]);
    const productSaved = selectResult[0];

    return this.productPersistenceMapper.toDomain(productSaved);
  }

  async update(product: IProduct): Promise<void> {
    const productPersistence =
      this.productPersistenceMapper.toPersistence(product);
    const result = await MysqlDataBase.update(
      `
      UPDATE products
      SET name = ?, type = ?, category_id = ?, description = ?, cost_price = ?, sale_price = ?,
        sativa = ?, indica = ?, thc = ?, cbd = ?, bank = ?, flawour = ?, effect = ?, user_updated = ?
      WHERE product_id = ?
      `,
      [
        productPersistence.name,
        productPersistence.type,
        productPersistence.category_id,
        productPersistence.description!,
        productPersistence.cost_price?.toString()!,
        productPersistence.sale_price?.toString()!,
        productPersistence.sativa?.toString()!,
        productPersistence.indica?.toString()!,
        productPersistence.thc?.toString()!,
        productPersistence.cbd?.toString()!,
        productPersistence.bank!,
        productPersistence.flawour!,
        productPersistence.effect!,
        productPersistence.user_updated!,
        productPersistence.product_id!,
      ]
    );

    if (result.affectedRows === 0) {
      Logger.error(`mysql : updateProduct : ProductDoesNotExistError`);
      throw new ProductDoesNotExistError();
    }

    return result;
  }

  async delete(productId: string): Promise<void> {
    const result = await MysqlDataBase.update(
      `UPDATE products SET deleted_at = NOW() WHERE product_id = ?`,
      [productId]
    );
    if (result.affectedRows === 0) {
      Logger.error(`mysql : delete : ProductDoesNotExistError`);
      throw new ProductDoesNotExistError();
    }
    return result;
  }
  async makeActive(productId: string): Promise<void> {
    const result = await MysqlDataBase.update(
      "UPDATE products SET active = ? WHERE product_id = ?",
      ["1", productId]
    );
    if (result.affectedRows === 0) {
      Logger.error(`mysql : makeActive : ProductDoesNotExistError`);
      throw new ProductDoesNotExistError();
    }
    return result;
  }
  async makeInactive(productId: string): Promise<void> {
    const result = await MysqlDataBase.update(
      "UPDATE products SET active = ? WHERE product_id = ?",
      ["0", productId]
    );
    if (result.affectedRows === 0) {
      Logger.error(`mysql : makeInactive : ProductDoesNotExistError`);
      throw new ProductDoesNotExistError();
    }
    return result;
  }
  async checkProductExistenceByName(name: string): Promise<boolean> {
    const product = await MysqlDataBase.query(
      `SELECT * FROM products WHERE name = ? and deleted_at IS NULL`,
      [name]
    );
    return !!product.length;
  }

  async getProductStock(productId: string): Promise<boolean> {
    const product = await MysqlDataBase.query(
      `SELECT stock FROM products WHERE product_id = ?`,
      [productId]
    );
    return !!product.length;
  }

  async updateProductStock(productId: string, stock: number): Promise<void> {
    const result = await MysqlDataBase.update(
      "UPDATE products SET stock = ? WHERE product_id = ?",
      [stock.toString(), productId]
    );
    if (result.affectedRows === 0) {
      Logger.error(`mysql : updateProductStock : ProductDoesNotExistError`);
      throw new ProductDoesNotExistError();
    }
    return result;
  }
  /*************************************PRODUCTS***************************************/

  /*************************************CATEGORIES***************************************/
  async createSubCategory(subcategory: ISubcategories): Promise<void> {
    const insertQuery = `INSERT INTO subcategories (name, category_id) VALUES (?,?)`;
    const result = await MysqlDataBase.update(insertQuery, [
      subcategory.name,
      subcategory.category_id,
    ]);
    if (result.affectedRows === 0) {
      Logger.error(`mysql : delete : SubCategoryCreationError`);
      throw new SubCategoryCreationError();
    }
    return result;
  }

  async getAllCategories(): Promise<ICategories[]> {
    const rows = await MysqlDataBase.query(
      `SELECT * FROM categories where deleted_at IS NULL`
    );
    return rows as unknown as ICategories[];
  }

  async getAllSubCategories(): Promise<ISubcategories[]> {
    const rows = await MysqlDataBase.query(
      `SELECT * FROM subcategories where deleted_at IS NULL`
    );
    return rows as unknown as ISubcategories[];
  }

  async deleteSubCategory(subcategoryId: string): Promise<void> {
    const result = await MysqlDataBase.update(
      `UPDATE subcategories SET deleted_at = NOW() WHERE subcategory_id = ?`,
      [subcategoryId]
    );
    if (result.affectedRows === 0) {
      Logger.error(`mysql : delete : SubCategoryDoesNotExistError`);
      throw new SubCategoryDoesNotExistError();
    }
  }

  async enrollSubCategories(
    subcategoryIds: string[],
    productId: string
  ): Promise<void> {
    for (const subcategoryId of subcategoryIds) {
      const insertQuery = `INSERT INTO product_subcategory (product_id, subcategory_id) VALUES (?,?)`;
      const result = await MysqlDataBase.update(insertQuery, [
        productId,
        subcategoryId,
      ]);
      if (result.affectedRows === 0) {
        Logger.error(`mysql : enrollSubCategories : SubCategoryCreationError`);
        throw new SubCategoryEnrollError();
      }
    }
  }
  /*************************************CATEGORIES***************************************/

  /*************************************ANCESTORS***************************************/
  async enrollAncestors(
    ancestorIds: string[],
    productId: string
  ): Promise<void> {
    for (const ancestorId of ancestorIds) {
      const insertQuery = `INSERT INTO ancestors (ancestor_id, product_id) VALUES (?, ?)`;
      const result = await MysqlDataBase.update(insertQuery, [
        ancestorId,
        productId,
      ]);
      if (result.affectedRows === 0) {
        Logger.error(`mysql : enrollAncestors : AncestorEnrollError`);
        throw new AncestorEnrollError();
      }
    }
  }

  /*************************************ANCESTORS***************************************/
}
