import { Injectable } from '@nestjs/common';
import { CreateOrderDTO } from './CreateOrderDTO';

@Injectable()
export class OrderService {
  createOrder(session: Record<string, any>, createorder: CreateOrderDTO) {}
}
