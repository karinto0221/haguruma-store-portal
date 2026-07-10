import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductEntity } from './product.entity';
import { Product } from './product.data';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productsRepository: Repository<ProductEntity>,
  ) {}

  async findAll(): Promise<Product[]> {
    const entities = await this.productsRepository.find({ order: { createdAt: 'ASC' } });
    return entities.map((e) => this.toProduct(e));
  }

  async findById(id: string): Promise<Product | undefined> {
    const entity = await this.productsRepository.findOne({ where: { id } });
    return entity ? this.toProduct(entity) : undefined;
  }

  private toProduct(entity: ProductEntity): Product {
    return {
      id: entity.id,
      name: entity.name,
      description: entity.description,
      priceFrom: entity.priceFrom,
    };
  }
}
