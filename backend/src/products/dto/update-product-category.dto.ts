import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class UpdateProductCategoryDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;
}
