import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from "@mui/material";
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
              <b>Last Updated</b>
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {items.map((item) => (
            <TableRow key={item.sku}>
              <TableCell>{item.sku}</TableCell>
              <TableCell>{item.availableQty}</TableCell>
              <TableCell>{item.reservedQty}</TableCell>
              <TableCell>
                {item.availableQty + item.reservedQty}
              </TableCell>
              <TableCell>{new Date(item.updatedAt).toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default InventoryTable;
