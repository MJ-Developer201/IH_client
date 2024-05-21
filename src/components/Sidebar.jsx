import React, { useState } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import WorkIcon from "@mui/icons-material/Work";
import InsightsIcon from "@mui/icons-material/Insights";
import SettingsIcon from "@mui/icons-material/Settings";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import "../styles/sidebar.css";

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <div className="sidebar-icon">
      <IconButton
        color="inherit"
        aria-label="open drawer"
        edge="start"
        onClick={handleDrawerOpen}
        sx={{ mr: 2 }}
      >
        <MenuIcon />
      </IconButton>
      <Drawer variant="temporary" open={open} onClose={handleDrawerClose}>
        <List>
          <ListItem button>
            <Link to={"/home"}>
              <ListItemIcon>
                <HomeIcon />
              </ListItemIcon>
            </Link>
            <ListItemText primary="Home" />
          </ListItem>
          <ListItem button>
            <Link to={"/profile"}>
              <ListItemIcon>
                <AccountBoxIcon />
              </ListItemIcon>
            </Link>

            <ListItemText primary="Profile" />
          </ListItem>
          <ListItem button>
            <Link to={"/projects"}>
              <ListItemIcon>
                <WorkIcon />
              </ListItemIcon>
            </Link>

            <ListItemText primary="Projects" />
          </ListItem>
          <ListItem button>
            <Link to={"/insight"}>
              <ListItemIcon>
                <InsightsIcon />
              </ListItemIcon>
            </Link>

            <ListItemText primary="Insight" />
          </ListItem>
          <ListItem button>
            <Link to={"/insight"}>
              <ListItemIcon>
                <SettingsIcon />
              </ListItemIcon>
            </Link>

            <ListItemText primary="Settings" />
          </ListItem>
        </List>
      </Drawer>
    </div>
  );
}
