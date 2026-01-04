import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Chip,
} from "@mui/material";
import { LOW_STOCK_THRESHOLD } from "@/constants/inventory";
import type { InventoryItem } from "@/api/inventory.api";

type Props = {
  items: InventoryItem[];
};

const InventoryTable = ({ items }: Props) => {
  if (items.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        No inventory items available.
      </Typography>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <b>SKU</b>
            </TableCell>
            <TableCell>
              <b>Available</b>
            </TableCell>
            <TableCell>
              <b>Reserved</b>
            </TableCell>
            <TableCell>
              <b>Total</b>
            </TableCell>
            <TableCell>
              <b>Status</b>
            </TableCell>
            <TableCell>
              <b>Last Updated</b>
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {items.map((item) => {
            const isLowStock = item.availableQty <= LOW_STOCK_THRESHOLD;

            return (
              <TableRow
                key={item.sku}
                sx={{
                  backgroundColor: isLowStock ? "#FEF2F2" : "inherit",
                }}
              >
                <TableCell>{item.sku}</TableCell>
                <TableCell>{item.availableQty}</TableCell>
                <TableCell>{item.reservedQty}</TableCell>
                <TableCell>{item.availableQty + item.reservedQty}</TableCell>
                <TableCell>
                  <Chip
                    size="small"
                    label={isLowStock ? "LOW" : "OK"}
                    color={isLowStock ? "error" : "success"}
                  />
                </TableCell>
                <TableCell>
                  {new Date(item.updatedAt).toLocaleString()}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default InventoryTable;
