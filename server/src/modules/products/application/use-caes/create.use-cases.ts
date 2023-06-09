import Logger from "../../../../apps/utils/logger";
import { IProduct, ISubcategories } from "../../domain/products";
import { ProductAlreadyExistsError } from "../../domain/products.exception";
import { IProductRepository } from "../../domain/products.repository";
import { IProductDTO, ProductDTOMapper } from "../products-dto.mapper";

export interface ICreateProductUseCase {
  createProduct(product: IProductDTO): Promise<IProduct | undefined>;
}

export class CreateProductUseCase implements ICreateProductUseCase {
  private productMapper: ProductDTOMapper = new ProductDTOMapper();
  productDomain!: IProduct;

  constructor(private readonly productRepository: IProductRepository) {}
  async createProduct(product: IProductDTO): Promise<IProduct | undefined> {
    // Comprobamos si el nombre ya existe en la tabla productos
    try {
      this.productDomain = this.productMapper.toDomain(product);
      const productExists =
        await this.productRepository.checkProductExistenceByName(
          this.productDomain.name
        );

      if (productExists) {
        Logger.error(
          `CreateProductUseCase : ProductAlreadyExistsError : ${this.productDomain.name}`
        );
        throw new ProductAlreadyExistsError(this.productDomain.name);
      }
      // Guardamos el socio en la base de datos
      const productRepository = await this.productRepository.create(
        this.productDomain
      );
      return productRepository;
    } catch (error) {
      throw error;
    }
  }

  async createSubcategory(subcategory: ISubcategories): Promise<void> {
    const result = await this.productRepository.createSubCategory(subcategory);
    return result;
  }
}
