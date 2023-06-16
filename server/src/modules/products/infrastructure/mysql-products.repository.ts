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

    const product = rows[0];
    product.subcategories = product.subcategories
      ? product.subcategories.split(",")
      : [];
    product.ancestors = product.ancestors ? product.ancestors.split(",") : [];

    return this.productPersistenceMapper.toDomain(rows[0]) as IProduct;
  }
  async getAll(type: string): Promise<IProduct[]> {
    const rows = await MysqlDataBase.query(
      `
      SELECT products.*,
      GROUP_CONCAT(DISTINCT ps.subcategory_id) AS subcategories,
      GROUP_CONCAT(DISTINCT a.ancestor_id) AS ancestors
      FROM products
      LEFT JOIN product_subcategory ps ON products.product_id = ps.product_id
      LEFT JOIN ancestors a ON products.product_id = a.product_id
      WHERE products.type = ? AND deleted_at IS NULL
      GROUP BY products.product_id;
      `,
      [type]
    );
    if (rows.length === 0) {
      Logger.error(`mysql : getAll : ProductNotFoundError`);
      throw new ProductNotFoundError();
    }
    return this.productPersistenceMapper.toDomainList(rows) as IProduct[];
  }

  async getAllFiltered(type: string): Promise<IProductSubsetDTO[]> {
    const rows = await MysqlDataBase.query(
      `SELECT product_id, code, name FROM products WHERE type = ? AND deleted_at IS NULL ORDER BY name`,
      [type]
    );
    return this.productPersistenceMapper.toDtoFilteredList(
      rows
    ) as unknown as IProductSubsetDTO[];
  }

  async create(product: IProduct): Promise<IProduct> {
    const productPersistence =
      this.productPersistenceMapper.toPersistence(product);
    const insertQuery = `INSERT INTO products (product_id, code, name, type, category_id, description, cost_price, sale_price, sativa, indica, thc, cbd, bank, flawour, effect, user_created)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const selectQuery = `SELECT * FROM products WHERE product_id = ?`;

    const values: any[] = [
      productPersistence.product_id!,
      productPersistence.code!,
      productPersistence.name!,
      productPersistence.type,
      productPersistence.category_id,
      productPersistence.description!,
      null, // cost_price (conditional)
      null, // sale_price (conditional)
      null, // sativa (conditional)
      null, // indica (conditional)
      null, // thc (conditional)
      null, // cbd (conditional)
      null, // bank (conditional)
      null, // flawour (conditional)
      null, // effect (conditional)
      productPersistence.user_created!,
    ];

    if (productPersistence.type === ProductsType.TERCEROS) {
      values[6] = productPersistence.cost_price?.toString()!;
      values[7] = productPersistence.sale_price?.toString()!;
    } else if (productPersistence.type === ProductsType.MANCOMUNADOS) {
      values[8] = productPersistence.sativa?.toString()!;
      values[9] = productPersistence.indica?.toString()!;
      values[10] = productPersistence.thc?.toString()!;
      values[11] = productPersistence.cbd?.toString()!;
      values[12] = productPersistence.bank!;
      values[13] = productPersistence.flawour!;
      values[14] = productPersistence.effect!;
    }

    await MysqlDataBase.update(insertQuery, values);

    // Guardar subcategorías
    await this.enrollSubCategories(
      productPersistence.subcategories,
      productPersistence.product_id!
    );

    if (productPersistence.type === ProductsType.MANCOMUNADOS) {
      // Guardar ancestros
      await this.enrollAncestors(
        productPersistence.ancestors!,
        productPersistence.product_id!
      );
    }

    const selectResult = await MysqlDataBase.query(selectQuery, [
      productPersistence.product_id!,
    ]);
    const productSaved = selectResult[0];

    return this.productPersistenceMapper.toDomain(productSaved);
  }

  async update(product: IProduct): Promise<void> {
    const productPersistence =
      this.productPersistenceMapper.toPersistence(product);
    const updateQuery = `
      UPDATE products
      SET name = ?, type = ?, category_id = ?, description = ?, cost_price = ?, sale_price = ?,
        sativa = ?, indica = ?, thc = ?, cbd = ?, bank = ?, flawour = ?, effect = ?, user_updated = ?
      WHERE product_id = ?
    `;

    const values: any[] = [
      productPersistence.name,
      productPersistence.type,
      productPersistence.category_id,
      productPersistence.description!,
      null, // cost_price (conditional)
      null, // sale_price (conditional)
      null, // sativa (conditional)
      null, // indica (conditional)
      null, // thc (conditional)
      null, // cbd (conditional)
      null, // bank (conditional)
      null, // flawour (conditional)
      null, // effect (conditional)
      productPersistence.user_updated!,
      productPersistence.product_id!,
    ];

    if (productPersistence.type === ProductsType.TERCEROS) {
      values[4] = productPersistence.cost_price?.toString()!;
      values[5] = productPersistence.sale_price?.toString()!;
    } else if (productPersistence.type === ProductsType.MANCOMUNADOS) {
      values[6] = productPersistence.sativa?.toString()!;
      values[7] = productPersistence.indica?.toString()!;
      values[8] = productPersistence.thc?.toString()!;
      values[9] = productPersistence.cbd?.toString()!;
      values[10] = productPersistence.bank!;
      values[11] = productPersistence.flawour!;
      values[12] = productPersistence.effect!;
    }

    const result = await MysqlDataBase.update(updateQuery, values);

    // Guardar subcategorías
    await this.enrollSubCategories(
      productPersistence.subcategories,
      productPersistence.product_id!
    );

    // Guardar ancestros
    await this.enrollAncestors(
      productPersistence.ancestors!,
      productPersistence.product_id!
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
      `SELECT * FROM categories where deleted_at IS NULL ORDER BY category_id`
    );
    return rows as unknown as ICategories[];
  }

  async getAllSubCategories(): Promise<ISubcategories[]> {
    const rows = await MysqlDataBase.query(
      `SELECT * FROM subcategories where deleted_at IS NULL ORDER BY name`
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
    const result = await MysqlDataBase.update(
      `DELETE from product_subcategory WHERE product_id = ?`,
      [productId]
    );
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
    const result = await MysqlDataBase.update(
      `DELETE from ancestors WHERE product_id = ?`,
      [productId]
    );
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
