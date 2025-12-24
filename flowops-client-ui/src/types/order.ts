export type OrderItem = {
  sku: string;
  qty: number;
  price: number;
};

export type OrderStatus = "Pending" | "Completed" | "Cancelled";

export type Order = {
  id: string;
  customer: string;
  address: string;
  status: OrderStatus;
  date: string;
  totalAmount: number;
  items: OrderItem[];
};

export type CreateOrderPayload = {
  customer: string;
  address: string;
  items: OrderItem[];
};

export type UpdateOrderPayload = {
  id: string;
  customer?: string;
  address?: string;
  items?: OrderItem[];
  status?: OrderStatus;
};
