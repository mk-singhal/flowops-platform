import axios from "axios";

export type InventoryItem = {
  sku: string;
  availableQty: number;
  reservedQty: number;
  totalQty: number;
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
  const response = await axios.get("/api/inventory", {
    params: { page, limit },
  });

  return response.data;
};

export const fetchInventoryBySku = async (
  sku: string
): Promise<InventoryItem> => {
  const response = await axios.get(`/api/inventory/${sku}`);
  return response.data;
};
