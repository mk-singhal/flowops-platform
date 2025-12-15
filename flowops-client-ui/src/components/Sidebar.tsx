import { useState } from "react";
import { Link } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  Box,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

import MenuIcon from "@mui/icons-material/Menu";
import FlowOpsLogo from "../assets/logo-transparent-sm.png";
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';

import { Sidebar, Menu, MenuItem } from "react-mui-sidebar";
import "./Sidebar.css";

const SidebarContent = () => (
  <>
    <Toolbar />
    <Menu subHeading="">
      <MenuItem icon={<DashboardOutlinedIcon />} component={Link} link="/">
        Dashboard
      </MenuItem>
      <MenuItem icon={<ShoppingBagOutlinedIcon />} component={Link} link="/orders">
        Orders
      </MenuItem>
      <MenuItem icon={<Inventory2OutlinedIcon />} component={Link} link="/inventory">
        Inventory
      </MenuItem>
    </Menu>
  </>
);

const SIDEBAR_WIDTH = 270;

const App = ({ children }: { children: React.ReactNode }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [open, setOpen] = useState(false);

  return (
    <Box sx={{ display: "flex" }}>
      {/* TOP APP BAR */}
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: "#FFFFFF",
          color: "#0F172A",
          borderBottom: "1px solid #E5E7EB",
          zIndex: theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar>
          {isMobile && (
            <IconButton
              color="inherit"
              edge="start"
              onClick={() => setOpen((prev) => !prev)}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          {/* CENTER LOGO (MOBILE ONLY) */}
          <Box
            component="img"
            src={FlowOpsLogo}
            alt="FlowOps"
            sx={{
              height: 72,
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
              display: { xs: "block", md: "none" },
            }}
          />

          {/* TITLE (DESKTOP ONLY) */}
          <Box
            component="img"
            src={FlowOpsLogo}
            alt="FlowOps"
            sx={{
              height: 72,
              display: { xs: "none", md: "block" },
              // ml: 2,
              fontWeight: 500,
            }}
          >
          </Box>
        </Toolbar>
      </AppBar>

      {/* SIDEBAR */}
      {isMobile ? (
        <Drawer
          open={open}
          onClose={() => setOpen(false)}
          sx={{
            "& .MuiDrawer-paper": {
              width: SIDEBAR_WIDTH,
              display: "flex",
              flexDirection: "column",
            },
          }}
        >
          <Box
            className="flowops-sidebar"
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              backgroundColor: "#0B1C2D",
            }}
          >
            <Sidebar 
              showProfile={false} 
              width={`${SIDEBAR_WIDTH}px`}
            >
              <SidebarContent />
            </Sidebar>
          </Box>
        </Drawer>
      ) : (
        <Box
          className="flowops-sidebar"
          sx={{
            width: SIDEBAR_WIDTH,
            backgroundColor: "#0B1C2D",
          }}
        >
          <Sidebar 
            showProfile={false} 
            width={`${SIDEBAR_WIDTH}px`}
          >
            <SidebarContent />
          </Sidebar>
        </Box>
      )}

      {/* MAIN CONTENT */}
      <Box
        component="main"
        sx={{
          backgroundColor: "#F8FAFC",
          minHeight: "100vh",
          color: "#0F172A",
          flexGrow: 1,
          p: 3,
          // mt: "64px", // height of AppBar
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};

export default App;
