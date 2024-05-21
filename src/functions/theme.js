import { Height } from "@mui/icons-material";
import { createTheme } from "@mui/material";
import { color } from "framer-motion";

const theme = createTheme({
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          border: "16px",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiInputBase-root": {
            height: "50px", // Change the height
            borderRadius: "12px",
          },
        },
      },
    },
  },
});

export default theme;
