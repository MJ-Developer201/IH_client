import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import { useState } from "react";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import HomeIcon from "@mui/icons-material/Home";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import { useContext } from "react";
import WorkIcon from "@mui/icons-material/Work";
import InsightsIcon from "@mui/icons-material/Insights";
import SettingsIcon from "@mui/icons-material/Settings";
import { Link, useLocation } from "react-router-dom";
import {
  WorkHistory,
  Assignment,
  LogoutOutlined,
  ImportantDevicesRounded,
} from "@mui/icons-material";
import { ProfileContext } from "../App";
import { Avatar } from "@mui/material";
import { Menu } from "@mui/material";
import { MenuItem, Button } from "@mui/material";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { signOut } from "aws-amplify/auth";
import { SidebarContext } from "../App";
import PeopleOutlineOutlinedIcon from "@mui/icons-material/PeopleOutlineOutlined";
import AddProjectBtnComp from "./AddProjectBtnComp";
import AddTicketModal from "./AddTicketModal";
import { useNavigate } from "react-router-dom";
import { AuthContext, UserContext } from "../App";

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

export default function Sidebar() {
  const queryClient = useQueryClient();
  const [userId, setUserId] = useContext(UserContext);
  const [signedIn, setSignedIn] = useContext(AuthContext);

  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const data = useContext(ProfileContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);
  const [isSidebarOpen, setSidebarOpen] = useContext(SidebarContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const shouldShowTicketButton = /\/project\/\d+/.test(location.pathname);

  const handleDrawerOpen = () => {
    setSidebarOpen(true);
  };

  const handleDrawerClose = () => {
    setSidebarOpen(false);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);
  const handleSuccessNotification = (message) => {
    console.log(message);
    handleCloseModal();
  };

  async function handleSignOut() {
    try {
      await signOut();
      setUserId(null);
      localStorage.removeItem("accessToken");
      console.log("User Signed Out");
      setSignedIn(false);
      queryClient.removeQueries();
      navigate("/signin");
    } catch (error) {
      console.log("error signing out: ", error);
    }
  }

  const menuItems = [
    { key: 1, text: "Home", icon: <HomeIcon />, link: "/" },
    { key: 2, text: "Profile", icon: <AccountBoxIcon />, link: "/profile" },
    {
      key: 3,
      text: "Projects",
      icon: <WorkHistory />,
      link: "/projects",
    },
    { key: 4, text: "Notes", icon: <Assignment />, link: "/notes" },
    // { key: 5, text: "Invites", icon: <SettingsIcon />, link: "/invites" },
    {
      key: 8,
      text: "Team",
      icon: <ImportantDevicesRounded />,
      link: "/team",
    },

    {
      key: 6,
      text: "Admin",
      icon: <PeopleOutlineOutlinedIcon />,
      link: "/admin",
    },
    {
      key: 7,
      text: "Logout",
      icon: <LogoutOutlined />,

      onClick: handleSignOut,
    },
  ];

  const handleMenuItemClick = (item) => {
    if (item.onClick) {
      item.onClick(); // If there's an onClick, call it
    } else if (item.link) {
      navigate(item.link); // Use React Router's navigate for link navigation
    }
  };

  return (
    <Box sx={{ display: "flex", marginBottom: "3rem" }}>
      <CssBaseline />
      <AppBar position="fixed" open={isSidebarOpen} elevation={1}>
        <Toolbar sx={{ backgroundColor: "white " }}>
          <IconButton
            color="black"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 5,
              ...(isSidebarOpen && { display: "none" }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              flexGrow: 1,
            }}
          >
            <Button onClick={handleOpenModal} variant="contained">
              + Ticket{" "}
            </Button>

            <Avatar onClick={handleMenu} src={(data && data.avatarUrl) || ""} />
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={isSidebarOpen}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.key} disablePadding sx={{ display: "block" }}>
              <Link to={item.link}>
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: isSidebarOpen ? "initial" : "center",
                    px: 2.5,
                  }}
                >
                  <ListItemIcon
                    onClick={() => handleMenuItemClick(item)}
                    sx={{
                      minWidth: 0,
                      mr: isSidebarOpen ? 3 : "auto",
                      justifyContent: "center",
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>

                  <ListItemText
                    primary={item.text}
                    sx={{ opacity: isSidebarOpen ? 1 : 0 }}
                  />
                </ListItemButton>
              </Link>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Menu anchorEl={anchorEl} open={openMenu} onClose={handleClose}>
        <Link to={"/profile"}>
          <MenuItem onClick={handleClose}>Profile</MenuItem>
        </Link>

        <Link to={"/invites"}>
          <MenuItem>Invites</MenuItem>
        </Link>
        {/* <MenuItem onClick={handleClose}>Settings</MenuItem> */}
        <MenuItem onClick={handleSignOut}>Logout</MenuItem>
      </Menu>

      {isModalOpen && (
        <AddTicketModal
          open={isModalOpen}
          handleClose={handleCloseModal}
          successNotification={setSuccessMessage}
        />
      )}
    </Box>
  );
}
