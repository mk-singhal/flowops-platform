import { useQuery } from "@tanstack/react-query";
import { fetchInventory } from "@/api/inventory.api";
import type { InventoryResponse } from "@/api/inventory.api";

export const INVENTORY_QUERY_KEY = "inventory";

export const useInventory = (page = 1, limit = 20) => {
  return useQuery<InventoryResponse>({
    queryKey: [INVENTORY_QUERY_KEY, page, limit],
    queryFn: () => fetchInventory(page, limit),
    placeholderData: (previousData) => previousData,
    staleTime: 30 * 1000, // 30 seconds
  });
};
