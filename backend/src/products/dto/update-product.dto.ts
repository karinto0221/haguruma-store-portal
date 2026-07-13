import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

// idは主キー・URLの一部として使われているため更新不可(変更したい場合は削除して作り直す想定)
export class UpdateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  priceFrom: number;

  @Type(() => Number)
  @IsInt()
  productCategoryId: number;
}
