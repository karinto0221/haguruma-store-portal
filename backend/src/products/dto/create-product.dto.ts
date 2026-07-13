import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString, Matches, MaxLength, Min } from 'class-validator';

export class CreateProductDto {
  // URLや注文テーブルから参照されるスラッグ形式のID。手動採番(将来的な自動生成は行わない)
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  @Matches(/^[a-z0-9-]+$/, {
    message: 'idは半角英小文字・数字・ハイフンのみ使用できます',
  })
  id: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
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
