import { IsIn, IsOptional, IsString } from 'class-validator';
import { ORDER_STATUSES, OrderStatus } from '../order-status';

export class QueryOrdersDto {
  @IsOptional()
  @IsIn(ORDER_STATUSES)
  status?: OrderStatus;

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
