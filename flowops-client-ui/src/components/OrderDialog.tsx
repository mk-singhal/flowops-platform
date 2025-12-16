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

type Item = {
  sku: string;
  qty: number;
  price: number;
};

type Props = {
  open: boolean;
  onClose: () => void;
  mode?: "create" | "edit";
  initialData?: any;
};

const CreateOrder = ({
  open,
  onClose,
  mode = "create",
  initialData,
}: Props) => {
  const [customer, setCustomer] = useState("");
  const [address, setAddress] = useState("");
  const [items, setItems] = useState<Item[]>([{ sku: "", qty: 1, price: 0 }]);

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
    field: keyof Item,
    value: string | number
  ) => {
    const updatedItems = [...items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setItems(updatedItems);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const payload = {
      id: initialData?.id,
      customer,
      address,
      items,
    };

    if (mode === "edit") {
      console.log("Updated Order:", payload);
    } else {
      console.log("New Order:", payload);
    }

    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle>
        {mode === "edit" ? "Edit Order" : "Create Order"}
      </DialogTitle>
      <DialogContent>
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
                  readOnly: true
                },
              }}
            />
          </Stack>
        </form>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button type="submit" variant="contained" form="create-order-form">
          {mode === "edit" ? "Update" : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateOrder;
