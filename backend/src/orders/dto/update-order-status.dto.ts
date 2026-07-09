import { IsIn, IsNotEmpty } from 'class-validator';
import { ORDER_STATUSES, OrderStatus } from '../order-status';

export class UpdateOrderStatusDto {
  @IsIn(ORDER_STATUSES)
  @IsNotEmpty()
  status: OrderStatus;
}
