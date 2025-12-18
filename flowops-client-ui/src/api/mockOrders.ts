import type { Order } from "@/types/order";

let orders: Order[] = [
  {
    id: "ORD-001",
    customer: "Rahul Sharma",
    address: "Delhi, India",
    status: "Pending",
    date: "23/01/2025",
    amount: 2400,
    items: [
      { sku: "SKU-101", qty: 2, price: 500 },
      { sku: "SKU-102", qty: 1, price: 1400 },
    ],
  },
  {
    id: "ORD-002",
    customer: "Ananya Gupta",
    address: "Mumbai, India",
    status: "Completed",
    date: "23/01/2025",
    amount: 1200,
    items: [{ sku: "SKU-103", qty: 1, price: 1200 }],
  },
];

const delay = (ms = 400) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const getOrders = async (): Promise<Order[]> => {
  await delay();
  return [...orders];
};

export const createOrder = async (order: Order): Promise<Order> => {
  await delay();
  orders = [...orders, order];
  return order;
};

export const updateOrder = async (order: Order): Promise<Order> => {
  await delay();
  orders = orders.map((o) => (o.id === order.id ? order : o));
  return order;
};

export const cancelOrder = async (orderId: string) => {
  await delay();
  orders = orders.map((o) =>
    o.id === orderId ? { ...o, status: "Cancelled" } : o
  );
};
