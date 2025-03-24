import { Body, Controller, Post, Session } from '@nestjs/common';
import { ProductsService } from '../product/product.service';
import { OrderService } from './order.service';
import { CreateOrderDTO } from './CreateOrderDTO';

@Controller()
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Post()
  createOrder(
    @Session() session: Record<string, any>,
    @Body() dataOrder: CreateOrderDTO,
  ) {
    return this.orderService.createOrder(session, dataOrder);
  }
}
