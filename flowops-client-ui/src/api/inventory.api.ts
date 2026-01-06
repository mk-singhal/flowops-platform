import axios from "axios";

const API_BASE = import.meta.env.VITE_INVENTORY_SERVICE_URL;

export type InventoryItem = {
  sku: string;
  availableQty: number;
  reservedQty: number;
  updatedAt: string;
};

export type InventoryResponse = {
  data: InventoryItem[];
  meta: {
    page: number;
    limit: number;
    total: number;
  };
};

export const fetchInventory = async (
  page = 1,
  limit = 20
): Promise<InventoryResponse> => {
  const response = await axios.get(`${API_BASE}/inventory`, {
    params: { page, limit },
  });
  
  return response.data;
};

export const fetchInventoryBySku = async (
  sku: string
): Promise<InventoryItem> => {
  const response = await axios.get(`${API_BASE}/inventory/${sku}`);
  return response.data;
};
