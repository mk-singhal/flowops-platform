import { Box, Typography, CircularProgress, Alert } from "@mui/material";
import { useInventory } from "@/hooks/useInventory";

const Inventory = () => {
  const { data, isLoading, isError } = useInventory(1, 20);
  const totalItems = data?.meta?.total ?? data?.data?.length ?? 0;

  return (
    <Box>
      {/* Page Header */}
      <Typography
        mb={2}
        variant="h4"
        fontWeight={500}
        fontFamily="sans-serif"
      >
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
        </Box>
      )}
    </Box>
  );
};

export default Inventory;
