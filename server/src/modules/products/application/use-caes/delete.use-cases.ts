import { IProductRepository } from "../../domain/products.repository";

export interface IDeleteProduct {
  deleteProduct(id: string): Promise<void>;
}

export interface IDeleteSubcategorie {
  deleteProduct(id: string): Promise<void>;
}

export class DeleteProductUseCase
  implements IDeleteProduct, IDeleteSubcategorie
{
  constructor(private readonly productRepository: IProductRepository) {}

  async deleteProduct(id: string): Promise<void> {
    const result = await this.productRepository.delete(id);
    return result;
  }

  async deleteSubcategorie(id: string): Promise<void> {
    const result = await this.productRepository.deleteSubCategory(id);
    return result;
  }
}
