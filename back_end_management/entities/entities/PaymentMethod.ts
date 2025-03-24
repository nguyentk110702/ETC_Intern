import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Order } from "./Order";

@Entity("payment_method", { schema: "nguyentk" })
export class PaymentMethod {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "name", length: 255 })
  name: string;

  @OneToMany(() => Order, (order) => order.paymentMethod)
  orders: Order[];
}
