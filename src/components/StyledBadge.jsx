import { styled } from "@mui/material/styles";
import Badge from "@mui/material/Badge";
import { color } from "framer-motion";

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: "#36454F",
    color: "#44b700",
    maxHeight: "1.2rem",
    maxWidth: "1.2rem",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",

      animation: "ripple 1.2s infinite ease-in-out",

      content: '""',
    },
  },
  "&:hover .MuiBadge-badge": {
    // backgroundColor: "gray",

    cursor: "pointer",
  },
}));

export default StyledBadge;
