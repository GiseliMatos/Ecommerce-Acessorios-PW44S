import { api } from "@/lib/axios";
import type { IProduct } from "@/commons/types";
import type { IAddress } from "./address-service";

export interface IOrderItem {
  id?: number;
  price: number;
  quantity: number;
  product: IProduct;
}

export interface IOrder {
  id?: number;
  dateOrder?: string;
  totalPrice: number;
  formaPagamento: string;
  formaEntrega: string;
  address: IAddress;
  items: IOrderItem[];
}

const findAllByAuthenticatedUser = () => {
  return api.get<IOrder[]>("/orders");
};

const create = (order: IOrder) => {
  return api.post<IOrder>("/orders", order);
};

const OrderService = {
  findAllByAuthenticatedUser,
  create,
};

export default OrderService;
