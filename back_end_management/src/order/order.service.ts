import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderDTO } from './CreateOrderDTO';
import { InjectRepository } from '@nestjs/typeorm';
import { Order, ShippingStatus } from '../../entities/entities/Order';
import { Repository } from 'typeorm';
import { PaymentMethod } from '../../entities/entities/PaymentMethod';
import { AuthEntity } from '../auth/auth.entity';
import { OrderItems } from '../../entities/entities/OrderItems';
import { ProductVariant } from '../../entities/entities/ProductVariant';
import { UpdateOrderDto } from './UpdateOrderDto';
import { isNumber } from 'class-validator';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(PaymentMethod)
    private readonly paymentMethodRepository: Repository<PaymentMethod>,
    @InjectRepository(AuthEntity)
    private readonly userRepository: Repository<AuthEntity>,
    @InjectRepository(ProductVariant)
    private readonly varianRepo: Repository<ProductVariant>,
  ) {}

  async createOrder(session: Record<string, any>, dataOrder: CreateOrderDTO) {
    return this.orderRepository.manager.transaction(async (transaction) => {
      const newOrder = transaction.create(Order, {
        orderCode: dataOrder.orderCode,
        customer: dataOrder.customer,
        address_shipping: dataOrder.addressShipping,
        area: dataOrder.area,
        deliveryCost: dataOrder.deliveryCost ?? 0,
        tax: dataOrder.tax ?? 0,
        discount: dataOrder.discount ?? 0,
        payment: dataOrder.payment,
        orderStatus: dataOrder.orderStatus,
        shippingStatus: dataOrder.shippingStatus || ShippingStatus.PENDING,
        created_at: new Date(),
        updated_at: new Date(),
      });

      await transaction.save(newOrder); // ✅ Lưu Order trước
      if (!dataOrder.addressShipping) {
        throw new BadRequestException('Shipping address is required');
      }

      let subtotal = 0; // ✅ Tính tổng giá trước khi áp dụng thuế và phí giao hàng
      const orderItems: OrderItems[] = [];

      for (const item of dataOrder.items) {
        const findVariant = await this.varianRepo.findOne({
          where: { id: item.variantId },
        });

        if (!findVariant)
          throw new NotFoundException(`Variant ${item.variantId} not found`);

        if ((findVariant.quantity ?? 0) < item.quantity)
          throw new BadRequestException(
            `Variant ${item.variantId} is out of stock`,
          );

        findVariant.quantity = (findVariant.quantity ?? 0) - item.quantity;
        await transaction.save(findVariant);

        // ✅ Tính giá từng item
        const itemPrice = findVariant.sellPrice * item.quantity;
        subtotal += itemPrice;

        // ✅ Gán orderId cho OrderItem
        const orderItem = transaction.create(OrderItems, {
          quantity: item.quantity,
          price: findVariant.sellPrice, // ✅ Lưu giá tại thời điểm đặt hàng
          total: itemPrice, // ✅ Lưu tổng giá cho item
          variant: findVariant,
          order: newOrder, // ✅ Đảm bảo orderId có giá trị
        });

        await transaction.save(orderItem);
        orderItems.push(orderItem);
      }

      // ✅ Tính tổng giá đơn hàng
      const totalPrice =
        subtotal +
        (dataOrder.deliveryCost ?? 0) -
        (dataOrder.discount ?? 0) +
        (dataOrder.tax ?? 0);

      // ✅ Cập nhật lại giá Order
      newOrder.orderItems = orderItems;
      newOrder.price = subtotal; // Tổng giá sản phẩm chưa tính phí
      newOrder.totalPrice = totalPrice; // Tổng giá cuối cùng sau khi cộng phí, thuế, trừ giảm giá

      return await transaction.save(newOrder);
    });
  }

  async getAllOrders() {
    return await this.orderRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async updateOrder(dataUpdate: UpdateOrderDto, id: number) {
    const findOrder = await this.orderRepository.findOneBy({ id });
    if (!findOrder) throw new NotFoundException('Order not found');
    findOrder.payment = dataUpdate.payment;
    findOrder.orderStatus = dataUpdate.orderStatus;
    if (dataUpdate.paymentMethodId !== undefined) {
      findOrder.paymentMethodId = dataUpdate.paymentMethodId;
    }
    findOrder.updatedAt = new Date();
    return await this.orderRepository.save(findOrder);
  }

  async softDeleteOrder(id: number) {
    const findOrder = await this.orderRepository.findOneBy({ id });

    if (!findOrder) throw new NotFoundException('Order not found');

    findOrder.isDelete = 1; // Đánh dấu là đã xóa

    return await this.orderRepository.save(findOrder);
  }

  async restoreOrder(id: number) {
    const findOrder = await this.orderRepository.findOneBy({ id });

    if (!findOrder) throw new NotFoundException('Order not found');

    if (findOrder.isDelete === 0)
      throw new BadRequestException('Order is not deleted');

    findOrder.isDelete = 0; // Khôi phục đơn hàng

    return await this.orderRepository.save(findOrder);
  }
}
