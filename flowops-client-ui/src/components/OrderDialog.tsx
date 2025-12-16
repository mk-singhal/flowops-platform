import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  Stack,
  Grid,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { useEffect, useState } from "react";
import type { Order, OrderItem } from "@/types";

type Props = {
  open: boolean;
  onClose: () => void;
  mode?: "create" | "edit";
  initialData?: Order | null;
  onSubmit: (order: Order) => void;
};

const CreateOrder = ({
  open,
  onClose,
  mode = "create",
  initialData,
  onSubmit,
}: Props) => {
  const [customer, setCustomer] = useState("");
  const [address, setAddress] = useState("");
  const [items, setItems] = useState<OrderItem[]>([
    { sku: "", qty: 1, price: 0 },
  ]);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  useEffect(() => {
    if (mode === "edit" && initialData) {
      setCustomer(initialData.customer);
      setAddress(initialData.address);
      setItems(initialData.items);
    } else {
      setCustomer("");
      setAddress("");
      setItems([{ sku: "", qty: 1, price: 0 }]);
    }
  }, [mode, initialData]);

  const totalAmount = items.reduce(
    (acc, item) => acc + item.qty * item.price,
    0
  );

  const handleClose = () => {
    onClose();
    setHasSubmitted(false);
    setCustomer("");
    setAddress("");
    setItems([{ sku: "", qty: 1, price: 0 }]);
  };

  const handleAddItem = () => {
    setItems([...items, { sku: "", qty: 1, price: 0.0 }]);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleItemChange = (
    index: number,
    field: keyof OrderItem,
    value: string | number
  ) => {
    const updatedItems = [...items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setItems(updatedItems);
  };

  const isFormValid = () => {
    if (!customer.trim()) return false;
    if (!address.trim()) return false;

    if (items.length === 0) return false;

    for (const item of items) {
      if (!item.sku.trim()) return false;
      if (item.qty <= 0) return false;
      if (item.price < 0) return false;
    }

    const skuSet = new Set(items.map((i) => i.sku.trim()));
    if (skuSet.size !== items.length) return false;

    return true;
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setHasSubmitted(true);

    if (!isFormValid()) {
      return;
    }

    const orderPayload = {
      id: initialData?.id ?? `ORD-${Date.now()}`,
      customer,
      address,
      status: initialData?.status ?? "Pending",
      date: initialData?.date ?? new Date().toLocaleDateString(),
      items,
      amount: items.reduce((acc, item) => acc + item.qty * item.price, 0),
    };

    onSubmit(orderPayload);
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle>
        {mode === "edit" ? "Edit Order" : "Create Order"}
      </DialogTitle>
      <DialogContent>
        {hasSubmitted && !isFormValid() && (
          <DialogContentText color="error">
            Please fix validation errors before submitting.
          </DialogContentText>
        )}
        <form onSubmit={handleSubmit} id="create-order-form">
          <Grid container spacing={3}>
            <Grid size={{ xs: 6, md: 4 }}>
              <TextField
                autoFocus
                required
                margin="dense"
                label="Customer Name"
                fullWidth
                value={customer}
                onChange={(e) => setCustomer(e.target.value)}
                variant="standard"
              />
            </Grid>
            <Grid size={{ xs: 6, md: 8 }}>
              <TextField
                required
                margin="dense"
                name="address"
                label="Address"
                fullWidth
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                variant="standard"
              />
            </Grid>
          </Grid>
          <DialogContentText mt={3}>Items</DialogContentText>
          {/* Items Table */}
          <Stack spacing={1}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>SKU</TableCell>
                  <TableCell width={120}>QTY</TableCell>
                  <TableCell width={200}>Price</TableCell>
                  <TableCell width={80} align="center">
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {items.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <TextField
                        value={item.sku}
                        onChange={(e) =>
                          handleItemChange(index, "sku", e.target.value)
                        }
                        placeholder="SKU"
                        variant="standard"
                        fullWidth
                        required
                      />
                    </TableCell>

                    <TableCell>
                      <TextField
                        type="number"
                        value={item.qty}
                        onChange={(e) =>
                          handleItemChange(index, "qty", Number(e.target.value))
                        }
                        variant="standard"
                        required
                        error={item.qty <= 0}
                        helperText={
                          item.qty <= 0 ? "Qty must be greater than 0" : ""
                        }
                        slotProps={{
                          htmlInput: {
                            min: 1,
                          },
                        }}
                      />
                    </TableCell>

                    <TableCell>
                      <TextField
                        type="number"
                        value={item.price}
                        onChange={(e) =>
                          handleItemChange(
                            index,
                            "price",
                            Number(e.target.value)
                          )
                        }
                        variant="standard"
                        required
                        error={item.price < 0}
                        helperText={
                          item.price < 0
                            ? "Price must be greater than or equal to 0"
                            : ""
                        }
                        slotProps={{
                          htmlInput: {
                            min: 0,
                            step: 0.01,
                          },
                        }}
                      />
                    </TableCell>

                    <TableCell align="center">
                      <IconButton
                        color="error"
                        disabled={items.length === 1}
                        onClick={() => handleRemoveItem(index)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <Button
              startIcon={<AddIcon />}
              onClick={handleAddItem}
              size="small"
              sx={{ alignSelf: "flex-start" }}
            >
              Add Item
            </Button>
          </Stack>
          <Stack direction="row" justifyContent="flex-end" mt={2}>
            <TextField
              label="Total Amount"
              value={totalAmount.toFixed(2)}
              variant="standard"
              slotProps={{
                htmlInput: {
                  readOnly: true,
                },
              }}
            />
          </Stack>
        </form>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          type="submit"
          variant="contained"
          form="create-order-form"
          disabled={!isFormValid()}
        >
          {mode === "edit" ? "Update" : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateOrder;
