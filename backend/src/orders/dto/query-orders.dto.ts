import { Transform } from 'class-transformer';
import { IsBoolean, IsIn, IsOptional, IsString } from 'class-validator';
import { ORDER_STATUSES, OrderStatus } from '../order-status';

export class QueryOrdersDto {
  @IsOptional()
  @IsIn(ORDER_STATUSES)
  status?: OrderStatus;

  @IsOptional()
  @Transform(({ value }) => {
    if (value === true || value === 'true') return true;
    if (value === false || value === 'false') return false;
    return value;
  })
  @IsBoolean()
  includeCompleted?: boolean;

  @IsOptional()
  @IsString()
  keyword?: string;

  // YYYY-MM-DD 形式を想定
  @IsOptional()
  @IsString()
  dateFrom?: string;

  // YYYY-MM-DD 形式を想定
  @IsOptional()
  @IsString()
  dateTo?: string;
}
