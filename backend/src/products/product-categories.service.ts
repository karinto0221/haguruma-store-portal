import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductCategoryEntity } from './product-category.entity';
import { CreateProductCategoryDto } from './dto/create-product-category.dto';
import { UpdateProductCategoryDto } from './dto/update-product-category.dto';

export interface ProductCategoryRecord {
  id: number;
  name: string;
}

// Postgresの外部キー制約違反(この場合: 参照している商品が残っている状態でカテゴリを削除しようとした)
const FOREIGN_KEY_VIOLATION = '23503';

@Injectable()
export class ProductCategoriesService {
  constructor(
    @InjectRepository(ProductCategoryEntity)
    private readonly repository: Repository<ProductCategoryEntity>,
  ) {}

  async findAll(): Promise<ProductCategoryRecord[]> {
    const entities = await this.repository.find({ order: { id: 'ASC' } });
    return entities.map((e) => this.toRecord(e));
  }

  async create(dto: CreateProductCategoryDto): Promise<ProductCategoryRecord> {
    const entity = this.repository.create({ name: dto.name });
    await this.repository.save(entity);
    return this.toRecord(entity);
  }

  async update(id: number, dto: UpdateProductCategoryDto): Promise<ProductCategoryRecord> {
    const entity = await this.repository.findOne({ where: { id } });
    if (!entity) {
      throw new NotFoundException('指定された商品カテゴリが見つかりません');
    }
    entity.name = dto.name;
    await this.repository.save(entity);
    return this.toRecord(entity);
  }

  async remove(id: number): Promise<void> {
    const entity = await this.repository.findOne({ where: { id } });
    if (!entity) {
      throw new NotFoundException('指定された商品カテゴリが見つかりません');
    }
    try {
      await this.repository.remove(entity);
    } catch (e: any) {
      if (e?.code === FOREIGN_KEY_VIOLATION) {
        throw new ConflictException(
          'このカテゴリに属する商品が存在するため削除できません。先に商品のカテゴリを変更するか、商品を削除してください',
        );
      }
      throw e;
    }
  }

  private toRecord(entity: ProductCategoryEntity): ProductCategoryRecord {
    return { id: entity.id, name: entity.name };
  }
}
