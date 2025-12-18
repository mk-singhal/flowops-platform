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
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import CreateOrder from "../components/OrderDialog";
import type { Order } from "@/types";
import { useState } from "react";
import {
  getOrders,
  createOrder,
  updateOrder,
  cancelOrder,
} from "@/api/mockOrders";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/api/queryKeys";

// const generateOrderId = (orders: Order[]) => {
//   const maxId = orders.reduce((max, order) => {
//     const num = Number(order.id.replace("ORD-", ""));
//     return Math.max(max, num);
//   }, 0);

//   return `ORD-${String(maxId + 1).padStart(3, "0")}`;
// };

const Orders = () => {
  // const [orders, setOrders] = useState<Order[]>([]);
  const [openCreateOrder, setOpenCreateOrder] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const queryClient = useQueryClient();

  const { data: orders = [], isLoading } = useQuery({
    queryKey: QUERY_KEYS.ORDERS,
    queryFn: getOrders,
  });

  const createOrderMutation = useMutation({
    mutationFn: createOrder,
    onSuccess: () => {
      setOpenCreateOrder(false);
      setSelectedOrder(null);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ORDERS });
    },
    onError: () => {
      alert("Failed to create order");
    },
  });

  const updateOrderMutation = useMutation({
    mutationFn: updateOrder,
    onSuccess: () => {
      setOpenCreateOrder(false);
      setSelectedOrder(null);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ORDERS });
    },
    onError: () => {
      alert("Failed to save order");
    },
  });

  const cancelOrderMutation = useMutation({
    mutationFn: (orderId: string) => cancelOrder(orderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ORDERS });
    },
    onError: () => {
      alert("Failed to cancel order");
    },
  });

  if (isLoading) {
    return <Typography>Loading orders...</Typography>;
  }

  // useEffect(() => {
  //   getOrders().then(setOrders);
  // }, []);

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
          disabled={createOrderMutation.isPending}
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
                <TableCell>
                  ₹
                  {order?.items
                    ?.reduce((acc, item) => acc + item.price * item.qty, 0)
                    .toFixed(2)}
                </TableCell>
                <TableCell>
                  {order.status === "Pending" && (
                    <>
                      <IconButton
                        aria-label="edit-order"
                        size="small"
                        onClick={() => handleEditOrder(order)}
                        disabled={updateOrderMutation.isPending}
                      >
                        <EditOutlinedIcon fontSize="inherit" />
                      </IconButton>

                      <IconButton
                        aria-label="cancel-order"
                        size="small"
                        color="error"
                        disabled={cancelOrderMutation.isPending}
                        onClick={() => cancelOrderMutation.mutate(order.id)}
                      >
                        <HighlightOffIcon fontSize="inherit" />
                      </IconButton>
                    </>
                  )}
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
        onSubmit={(orderPayload) => {
          if (selectedOrder) {
            updateOrderMutation.mutate(orderPayload);
          } else {
            createOrderMutation.mutate(orderPayload);
          }
        }}
        isSubmitting={
          createOrderMutation.isPending || updateOrderMutation.isPending
        }
      />
    </Box>
  );
};

export default Orders;
