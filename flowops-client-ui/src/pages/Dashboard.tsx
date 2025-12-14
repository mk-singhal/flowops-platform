import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardActionArea from "@mui/material/CardActionArea";
import CardMedia from "@mui/material/CardMedia";
import Grid from '@mui/material/Grid';
import CartCrossIcon from "../assets/cart-cross-svgrepo-com.svg";
import CartLargeIcon from "../assets/cart-large-svgrepo-com.svg";
import StockIcon from "../assets/stock-svgrepo-com.svg";
import WarehouseIcon from "../assets/warehouse-svgrepo-com.svg";

function Dashboard() {
  return (
    <>
      <Typography mb={2} p={2} variant="h4" fontWeight={500} fontFamily={"sans-serif"}>
				Dashboard
			</Typography>
			<Grid container spacing={1}>
				<Grid size={{ xs: 6, md: 4, lg: 3 }}>
					<Card sx={{ maxWidth: 250, m: {xs: 1, md: 4} }}>
						<CardActionArea
							href="/orders"
						>
							<CardMedia
								component="img"
								height="164"
								image={CartLargeIcon}
								alt="green iguana"
							/>
							<CardContent>
								<Typography gutterBottom variant="h5" component="div">
									Total Orders
								</Typography>
								<Typography variant="h6" sx={{ color: 'text.secondary' }}>
									163
								</Typography>
							</CardContent>
						</CardActionArea>
					</Card>
				</Grid>
				<Grid size={{ xs: 6, md: 4, lg: 3 }}>
					<Card sx={{ maxWidth: 250, m: {xs: 1, md: 4} }}>
						<CardActionArea
							href="/inventory"
						>
							<CardMedia
								component="img"
								height="164"
								image={StockIcon}
								alt="green iguana"
							/>
							<CardContent>
								<Typography gutterBottom variant="h5" component="div">
									Total Inventory
								</Typography>
								<Typography variant="h6" sx={{ color: 'text.secondary' }}>
									202
								</Typography>
							</CardContent>
						</CardActionArea>
					</Card>
				</Grid>
				<Grid size={{ xs: 6, md: 4, lg: 3 }}>
					<Card sx={{ maxWidth: 250, m: {xs: 1, md: 4} }}>
						<CardActionArea
							href="/orders"
						>
							<CardMedia
								component="img"
								height="164"
								image={CartCrossIcon}
								alt="green iguana"
							/>
							<CardContent>
								<Typography gutterBottom variant="h5" component="div">
									Pending Orders
								</Typography>
								<Typography variant="h6" sx={{ color: 'text.secondary' }}>
									11
								</Typography>
							</CardContent>
						</CardActionArea>
					</Card>
				</Grid>
				<Grid size={{ xs: 6, md: 4, lg: 3 }}>
					<Card sx={{ maxWidth: 250, m: {xs: 1, md: 4} }}>
						<CardActionArea
							href="/inventory"
						>
							<CardMedia
								component="img"
								// width="100"
								height="164px"
								image={WarehouseIcon}
								alt="green iguana"
							/>
							<CardContent>
								<Typography gutterBottom variant="h5" component="div">
									Low Stock Items
								</Typography>
								<Typography variant="h6" sx={{ color: 'text.secondary' }}>
									3
								</Typography>
							</CardContent>
						</CardActionArea>
					</Card>
				</Grid>
			</Grid>
    </>
  );
}

export default Dashboard;
