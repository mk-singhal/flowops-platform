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
  amount: number;
  items: OrderItem[];
};
