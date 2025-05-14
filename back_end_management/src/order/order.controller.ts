import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  Session,
  UseGuards,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDTO } from './CreateOrderDTO';
import { AuthGuard } from '../auth/auth.guard';
import { UpdateOrderDto } from './UpdateOrderDto';

@UseGuards(AuthGuard)
@Controller('order')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Post()
  createOrder(
    @Session() session: Record<string, any>,
    @Body() dataOrder: CreateOrderDTO,
  ) {
    return this.orderService.createOrder(session, dataOrder);
  }

  @Get()
  async getAllOrders(@Query('search') searchTerm?: string) {
    return this.orderService.getAllOrders(searchTerm);
  }

  @Get(':id')
  async getOrderDetail(@Param('id', new ParseIntPipe()) id: number) {
    const order = await this.orderService.getOrderDetail(id);
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return order;
  }

  @Put(':id')
  async updateOrder(
    @Body() dataOrder: UpdateOrderDto,
    @Param('id', new ParseIntPipe()) id: number,
  ) {
    return this.orderService.updateOrder(dataOrder, id);
  }

  @Delete(':id')
  async deleteOrder(@Param('id', new ParseIntPipe()) id: number) {
    return this.orderService.softDeleteOrder(id);
  }

  @Patch(':id/restore')
  async restoreOrder(@Param('id') id: number) {
    const order = await this.orderService.restoreOrder(id);
    if (!order) throw new NotFoundException('Order not found');
    return { message: 'Order restored successfully' };
  }
}
