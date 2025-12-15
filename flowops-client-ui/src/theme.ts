import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    background: {
      default: "#f4f6f8",
    },
    primary: {
      main: "#1976d2", // sidebar color
    },
  },
});

export default theme;
