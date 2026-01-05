import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  TextField,
  FormControlLabel,
  Checkbox,
  Button,
} from "@mui/material";
import { useMemo, useState } from "react";
import { LOW_STOCK_THRESHOLD } from "@/constants/inventory";
import { useInventory } from "@/hooks/useInventory";
import InventoryTable from "@/components/InventoryTable";

const Inventory = () => {
  const { data, isLoading, isError, refetch, isFetching } = useInventory(1, 20);
  const totalItems = data?.meta?.total ?? data?.data?.length ?? 0;

  const [search, setSearch] = useState("");
  const [lowStockOnly, setLowStockOnly] = useState(false);

  const filteredItems = useMemo(() => {
    if (!data?.data) return [];

    return data.data.filter((item) => {
      const matchesSearch = item.sku
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesLowStock = lowStockOnly
        ? item.availableQty <= LOW_STOCK_THRESHOLD
        : true;

      return matchesSearch && matchesLowStock;
    });
  }, [data, search, lowStockOnly]);

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
          <Box
            display="flex"
            gap={2}
            alignItems="center"
            flexWrap="wrap"
            mb={2}
          >
            <TextField
              size="small"
              label="Search by SKU"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={lowStockOnly}
                  onChange={(e) => setLowStockOnly(e.target.checked)}
                />
              }
              label="Low stock only"
            />

            <Button
              variant="outlined"
              size="small"
              onClick={() => refetch()}
              disabled={isFetching}
            >
              {isFetching ? "Refreshing..." : "Refresh"}
            </Button>
          </Box>
          {data && filteredItems.length > 0 ? (
            <InventoryTable items={filteredItems} />
          ) : (
            <Alert severity="info">
              No inventory items match the selected filters.
            </Alert>
          )}
        </Box>
      )}
    </Box>
  );
};

export default Inventory;
