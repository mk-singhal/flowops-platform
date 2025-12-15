import { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import CreateOrder from "../components/CreateOrder";

type Order = {
  id: string;
  customer: string;
  address: string;
  status: string;
  date: string;
  amount: number | null;
  items: {
    sku: string;
    qty: number;
    price: number;
  }[];
};

const Orders = () => {
  const [openCreateOrder, setOpenCreateOrder] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const orders: Order[] = [
    {
      id: "ORD-001",
      customer: "Rahul Sharma",
      address: "Delhi, India",
      status: "Pending",
      date: "23-01-2025",
      amount: null,
      items: [
        { sku: "SKU-101", qty: 2, price: 500 },
        { sku: "SKU-102", qty: 1, price: 1400 },
      ],
    },
    {
      id: "ORD-002",
      customer: "Ananya Gupta",
      address: "Mumbai, India",
      status: "Completed",
      date: "23-01-2025",
      amount: null,
      items: [{ sku: "SKU-103", qty: 1, price: 1200 }],
    },
  ];

  const handleEditOrder = (order: Order) => {
    setSelectedOrder(order);
    setOpenCreateOrder(true);
  };

  return (
    <Box p={2}>
      {/* Header */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4" fontWeight={500}>
          Orders
        </Typography>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenCreateOrder(true)}
        >
          Create Order
        </Button>
      </Box>

      {/* Orders Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <b>Order ID</b>
              </TableCell>
              <TableCell>
                <b>Customer</b>
              </TableCell>
              <TableCell>
                <b>Status</b>
              </TableCell>
              <TableCell>
                <b>Date</b>
              </TableCell>
              <TableCell>
                <b>Amount</b>
              </TableCell>
              <TableCell>
                <b>Action</b>
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.id}</TableCell>
                <TableCell>{order.customer}</TableCell>
                <TableCell>
                  <Chip
                    label={order.status}
                    color={
                      order.status === "Completed"
                        ? "success"
                        : order.status === "Pending"
                          ? "warning"
                          : "error"
                    }
                    size="small"
                  />
                </TableCell>
                <TableCell>{order.date}</TableCell>
                <TableCell>{order.amount}</TableCell>
                <TableCell>
                  <IconButton
                    aria-label="edit-order"
                    size="small"
                    onClick={() => handleEditOrder(order)}
                  >
                    <EditOutlinedIcon fontSize="inherit" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Create Order Dialog */}
      <CreateOrder
        open={openCreateOrder}
        mode={selectedOrder ? "edit" : "create"}
        initialData={selectedOrder}
        onClose={() => {
          setOpenCreateOrder(false);
          setSelectedOrder(null);
        }}
      />
    </Box>
  );
};

export default Orders;
