import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light", // 🔁 change to "dark" if you want full dark UI
    background: {
      default: "#f4f6f8",
    },
  },
});

export default theme;
