import { Box, Typography, CircularProgress, Alert } from "@mui/material";
import { useInventory } from "@/hooks/useInventory";
import InventoryTable from "@/components/InventoryTable";

const Inventory = () => {
  const { data, isLoading, isError } = useInventory(1, 20);
  const totalItems = data?.meta?.total ?? data?.data?.length ?? 0;

  return (
    <Box p={2}>
      {/* Page Header */}
      <Typography mb={3} variant="h4" fontWeight={500}>
        Inventory
      </Typography>

      {/* Loading State */}
      {isLoading && (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      )}

      {/* Error State */}
      {isError && (
        <Alert severity="error">
          Failed to load inventory. Please try again.
        </Alert>
      )}

      {/* Success Placeholder */}
      {data && (
        <Box mt={2}>
          <Typography variant="body2" color="text.secondary">
            Inventory data loaded successfully.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Total items: {totalItems}
          </Typography>
          <InventoryTable
            items={
              data?.data || [
                {
                  sku: "SKU-1889",
                  availableQty: 220,
                  reservedQty: 20,
                  totalQty: 240,
                  updatedAt: "01-01-2026",
                },
                {
                  sku: "SKU-4603",
                  availableQty: 5,
                  reservedQty: 2,
                  totalQty: 7,
                  updatedAt: "01-01-2026",
                },
                {
                  sku: "SKU-2323",
                  availableQty: 110,
                  reservedQty: 10,
                  totalQty: 120,
                  updatedAt: "02-01-2026",
                }
              ]
            }
          />
        </Box>
      )}
    </Box>
  );
};

export default Inventory;
