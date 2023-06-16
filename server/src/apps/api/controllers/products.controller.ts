import { FilesCaseUses } from "../../../modules/files/application/files.use-case";
import { MysqlFilesRepository } from "../../../modules/files/infrastructure/mysql-files.repository";
import { ProductDTOMapper } from "../../../modules/products/application/products-dto.mapper";
import { CreateProductUseCase } from "../../../modules/products/application/use-caes/create.use-cases";
import { DeleteProductUseCase } from "../../../modules/products/application/use-caes/delete.use-cases";
import { GetProductsUseCase } from "../../../modules/products/application/use-caes/get.use-cases";
import { UpdateProductUseCase } from "../../../modules/products/application/use-caes/update.use-cases";
import {
  AncestorEnrollError,
  ProductAlreadyExistsError,
  ProductDoesNotExistError,
  ProductNotFoundError,
  SubCategoryDoesNotExistError,
  SubCategoryEnrollError,
} from "../../../modules/products/domain/products.exception";
import { Request, Response } from "express";
import { DomainValidationError } from "../../../modules/shared/domain/domain-validation.exception";
import {
  BadRequest,
  NotFound,
  InternalServerError,
  Conflict,
} from "../error/http-error";
import { ProductType } from "aws-sdk/clients/servicecatalog";
export class ProductController {
  productMapper = new ProductDTOMapper();
  constructor(
    private readonly createProductUseCase: CreateProductUseCase,
    private readonly getProductUseCase: GetProductsUseCase,
    private readonly updateProductUseCase: UpdateProductUseCase,
    private readonly deleteProductUseCase: DeleteProductUseCase
  ) {}

  async getById(request: Request, response: Response): Promise<void> {
    const { id } = request.params;
    try {
      const product = await this.getProductUseCase.getProduct(id);
      response.json(this.productMapper.toDTO(product));
    } catch (error) {
      if (error instanceof DomainValidationError) {
        response.send(BadRequest(error.message));
      } else if (error instanceof ProductDoesNotExistError) {
        response.send(NotFound(error.message));
      } else {
        response.send(InternalServerError(error));
      }
    }
  }

  async getAll(request: Request, response: Response): Promise<void> {
    const { type } = request.params;
    try {
      const products = await this.getProductUseCase.getAllProducts(type);
      const productsDTOs = this.productMapper.toDTOList(products);
      response.json(productsDTOs);
    } catch (error: any) {
      if (error instanceof DomainValidationError) {
        response.send(BadRequest(error.message));
      } else if (error instanceof ProductNotFoundError) {
        response.send(NotFound(error.message));
      } else {
        response.send(InternalServerError(error));
      }
    }
  }

  async getAllFiltered(request: Request, response: Response): Promise<void> {
    const { type } = request.params;
    try {
      const products = await this.getProductUseCase.getAllProductsFiltered(
        type
      );
      response.json(products);
    } catch (error: any) {
      if (error instanceof DomainValidationError) {
        response.send(BadRequest(error.message));
      } else if (error instanceof ProductNotFoundError) {
        response.send(NotFound(error.message));
      } else {
        response.send(InternalServerError(error));
      }
    }
  }

  async getCategories(request: Request, response: Response): Promise<void> {
    try {
      const categories = await this.getProductUseCase.getAllCategories();
      response.json(categories);
    } catch (error: any) {
      response.send(InternalServerError(error));
    }
  }

  async getSubCategories(request: Request, response: Response): Promise<void> {
    try {
      const subcategories = await this.getProductUseCase.getAllSubcategories();
      response.json(subcategories);
    } catch (error: any) {
      response.send(InternalServerError(error));
    }
  }

  async create(request: Request, response: Response): Promise<void> {
    try {
      const product = await this.createProductUseCase.createProduct(
        request.body
      );
      const productDTOs = this.productMapper.toDTO(product!);
      response.json(productDTOs);
    } catch (error) {
      if (error instanceof DomainValidationError) {
        response.send(BadRequest(error.message));
      } else if (error instanceof ProductAlreadyExistsError) {
        response.send(Conflict(error.message));
      } else {
        response.send(InternalServerError(error));
      }
    }
  }

  async update(request: Request, response: Response): Promise<void> {
    try {
      const result = await this.updateProductUseCase.updateProduct(
        request.body
      );
      response.send(result);
    } catch (error) {
      if (error instanceof DomainValidationError) {
        response.send(BadRequest(error.message));
      } else if (error instanceof ProductDoesNotExistError) {
        response.send(NotFound(error.message));
      } else {
        response.send(InternalServerError(error));
      }
    }
  }

  async deleteProduct(request: Request, response: Response): Promise<void> {
    const { id } = request.params;
    const filesRepository = new MysqlFilesRepository();
    const filesUseCase = new FilesCaseUses(filesRepository);

    try {
      filesUseCase.deleteFiles(id);
      const result = await this.deleteProductUseCase.deleteProduct(id);
      response.send(result);
    } catch (error) {
      if (error instanceof DomainValidationError) {
        response.send(BadRequest(error.message));
      } else if (error instanceof ProductDoesNotExistError) {
        response.send(NotFound(error.message));
      } else {
        response.send(InternalServerError(error));
      }
    }
  }

  async createSubcategory(request: Request, response: Response): Promise<void> {
    try {
      const result = await this.createProductUseCase.createSubcategory(
        request.body
      );
      response.send(result);
    } catch (error) {
      if (error instanceof DomainValidationError) {
        response.send(BadRequest(error.message));
      } else {
        response.send(InternalServerError(error));
      }
    }
  }

  async deleteSubCategory(request: Request, response: Response): Promise<void> {
    const { id } = request.params;
    const filesRepository = new MysqlFilesRepository();
    const filesUseCase = new FilesCaseUses(filesRepository);

    try {
      filesUseCase.deleteFiles(id);
      const result = await this.deleteProductUseCase.deleteProduct(id);
      response.send(result);
    } catch (error) {
      if (error instanceof DomainValidationError) {
        response.send(BadRequest(error.message));
      } else if (error instanceof SubCategoryDoesNotExistError) {
        response.send(NotFound(error.message));
      } else {
        response.send(InternalServerError(error));
      }
    }
  }

  async makeActive(request: Request, response: Response): Promise<void> {
    const { id } = request.params;
    try {
      const result = await this.updateProductUseCase.makeActive(id);
      response.send(result);
    } catch (error) {
      if (error instanceof DomainValidationError) {
        response.send(BadRequest(error.message));
      } else if (error instanceof ProductDoesNotExistError) {
        response.send(NotFound(error.message));
      } else {
        response.send(InternalServerError(error));
      }
    }
  }

  async makeInactive(request: Request, response: Response): Promise<void> {
    const { id } = request.params;
    try {
      const result = await this.updateProductUseCase.makeInactive(id);
      response.send(result);
    } catch (error) {
      if (error instanceof DomainValidationError) {
        response.send(BadRequest(error.message));
      } else if (error instanceof ProductDoesNotExistError) {
        response.send(NotFound(error.message));
      } else {
        response.send(InternalServerError(error));
      }
    }
  }

  async enrollSubcategories(
    request: Request,
    response: Response
  ): Promise<void> {
    try {
      const result = await this.updateProductUseCase.enrollSubcategories(
        request.body.subcategoryIds,
        request.body.productId
      );
      response.send(result);
    } catch (error) {
      if (error instanceof SubCategoryEnrollError) {
        response.send(BadRequest(error.message));
      } else {
        response.send(InternalServerError(error));
      }
    }
  }

  async enrollAncestors(request: Request, response: Response): Promise<void> {
    try {
      const result = await this.updateProductUseCase.enrollAncestor(
        request.body.ancestorIds,
        request.body.productId
      );
      response.send(result);
    } catch (error) {
      if (error instanceof AncestorEnrollError) {
        response.send(BadRequest(error.message));
      } else {
        response.send(InternalServerError(error));
      }
    }
  }
}
