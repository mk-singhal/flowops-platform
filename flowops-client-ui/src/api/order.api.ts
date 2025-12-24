import axios from "axios";
import type {
  Order,
  CreateOrderPayload,
  UpdateOrderPayload,
} from "@/types";

const API_BASE = import.meta.env.VITE_ORDER_SERVICE_URL;

type OrdersResponse = {
  data: any[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

const mapOrder = (order: any): Order => ({
  id: order._id,
  customer: order.customer,
  address: order.address,
  status: order.status,
  items: order.items,
  totalAmount: order.totalAmount,
  date: new Date(order.createdAt).toLocaleDateString(),
});

export const getOrders = async (): Promise<Order[]> => {
  const res = await axios.get<OrdersResponse>(`${API_BASE}/orders`);
  return res.data.data.map(mapOrder);
};

export const createOrder = async (payload: CreateOrderPayload) => {
  const res = await axios.post(`${API_BASE}/orders`, payload);
  return res.data;
};

export const updateOrder = async (payload: UpdateOrderPayload) => {
  const { id, items, ...rest } = payload;
  const sanitizedItems = items?.map(({ sku, qty, price }) => ({
    sku,
    qty,
    price,
  }));

  const res = await axios.put(`${API_BASE}/orders/${id}`, {
    ...rest,
    ...(sanitizedItems && { items: sanitizedItems }),
  });
  // const res = await axios.put(`${API_BASE}/orders/${id}`, rest);
  return res.data;
};

export const cancelOrder = async (orderId: string) => {
  const res = await axios.delete(`${API_BASE}/orders/${orderId}`);
  return res.data;
};
