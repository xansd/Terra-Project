import { IProductRepository } from "../../domain/products.repository";

export interface IDeleteProduct {
  deleteProduct(id: string, user: string): Promise<void>;
}

export interface IDeleteSubcategorie {
  deleteSubcategories(id: string): Promise<void>;
}

export class DeleteProductUseCase
  implements IDeleteProduct, IDeleteSubcategorie
{
  constructor(private readonly productRepository: IProductRepository) {}

  async deleteProduct(id: string, user: string): Promise<void> {
    const result = await this.productRepository.delete(id, user);
    return result;
  }

  async deleteSubcategories(id: string): Promise<void> {
    const result = await this.productRepository.deleteSubCategory(id);
    return result;
  }
}
