import Logger from "../../../../apps/utils/logger";
import { DomainValidationError } from "../../../shared/domain/domain-validation.exception";
import { IProduct, StockOperations } from "../../domain/products";
import { ProductAlreadyExistsError } from "../../domain/products.exception";
import { IProductRepository } from "../../domain/products.repository";
import { IProductDTO, ProductDTOMapper } from "../products-dto.mapper";
import { UpdateStockService } from "../services/update-stock.service";

export interface IUpdateProductUseCase {
  updateProduct(product: IProductDTO): Promise<void>;
}

export interface IEnrollSubcategoiresUseCase {
  enrollSubcategories(
    subcategoryIds: string[],
    productId: string
  ): Promise<void>;
}

export interface IEnrollAncestorsUseCase {
  enrollAncestor(ancestorIds: string[], productId: string): Promise<void>;
}

export interface IMakeActive {
  makeActive(id: string, user: string): Promise<void>;
}

export interface IMakeInactive {
  makeInactive(id: string, user: string): Promise<void>;
}

export class UpdateProductUseCase
  implements
    IUpdateProductUseCase,
    IEnrollSubcategoiresUseCase,
    IEnrollAncestorsUseCase,
    IMakeActive,
    IMakeInactive
{
  private productMapper: ProductDTOMapper = new ProductDTOMapper();
  productDomain!: IProduct;
  private stockService: UpdateStockService = new UpdateStockService(
    this.productRepository
  );

  constructor(private readonly productRepository: IProductRepository) {}
  async updateProduct(product: IProductDTO): Promise<void> {
    // Comprobamos si el nombre ya existe en la tabla productos
    try {
      this.productDomain = this.productMapper.toDomain(product);
      // Comprobamos si ya exsite el nombre de producto
      const productExists = await this.productRepository.getById(
        product.product_id!
      );
      const originalName = productExists.name.toLowerCase();
      // Verificar si el name ha cambiado
      if (product.name.toLowerCase() !== originalName) {
        // Realizar la consulta para verificar duplicados
        const isNameDuplicate =
          await this.productRepository.checkProductExistenceByName(
            product.name
          );

        if (isNameDuplicate) {
          Logger.error(
            `UpdateProductUseCase : ProductAlreadyExistsError : ${this.productDomain.name}`
          );
          throw new ProductAlreadyExistsError(this.productDomain.name);
        }
      }

      const result = await this.productRepository.update(this.productDomain);
      return result;
    } catch (error) {
      if (error instanceof DomainValidationError) {
        Logger.error(`UpdateProductUseCase : DomainValidationError  `);
        throw new DomainValidationError(error.message);
      }
      throw error;
    }
  }

  async updateProductStock(
    productId: string,
    stock: number,
    operation: StockOperations,
    user: string
  ): Promise<void> {
    let newStockValue = 0;
    switch (operation) {
      // case StockOperations.SUBSTRACT:
      //   newStockValue = await this.stockService.subtractProductStock(
      //     productId,
      //     stock
      //   );
      //   break;
      case StockOperations.UPDATE:
        newStockValue = this.stockService.validateUpdateProductStock(stock);
        break;
    }
    const result = await this.productRepository.updateProductStock(
      productId,
      stock,
      user
    );
    return result;
  }

  async enrollSubcategories(
    subcategoryIds: string[],
    productId: string
  ): Promise<void> {
    const result = await this.productRepository.enrollSubCategories(
      subcategoryIds,
      productId
    );
    return result;
  }

  async enrollAncestor(
    ancestorIds: string[],
    productId: string
  ): Promise<void> {
    const result = await this.productRepository.enrollAncestors(
      ancestorIds,
      productId
    );
    return result;
  }

  async makeActive(id: string, user: string): Promise<void> {
    const result = await this.productRepository.makeActive(id, user);
    return result;
  }

  async makeInactive(id: string, user: string): Promise<void> {
    const result = await this.productRepository.makeInactive(id, user);
    return result;
  }
}
