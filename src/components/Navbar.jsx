import React, { useContext } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  InputBase,
  MenuItem,
  Menu,
  Avatar,
} from "@mui/material";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { AuthContext, ProfileContext } from "../App";
import { signOut } from "aws-amplify/auth";
import HomeIcon from "@mui/icons-material/Home";
import { AssignmentOutlined } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import "../styles/navbar.css";
import { PhotoUrlContext, UserContext } from "../App";
import AddProjectBtnComp from "./AddProjectBtnComp";

export default function Navbar() {
  const data = useContext(ProfileContext);
  const queryClient = useQueryClient();
  const [userId, setUserId] = useContext(UserContext);
  const [signedIn, setSignedIn] = useContext(AuthContext);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  async function handleSignOut() {
    try {
      await signOut();
      setUserId("");
      localStorage.removeItem("accessToken");
      console.log("User Signed Out");
      setSignedIn(false);
      queryClient.removeQueries();
      navigate("/signin");
    } catch (error) {
      console.log("error signing out: ", error);
    }
  }

  return (
    <AppBar
      sx={{
        backgroundColor: "white",
        color: "black",
      }}
      position="static"
    >
      <Toolbar style={{ justifyContent: "space-between" }}>
        {/* <Sidebar /> */}
        <Link to={"/"}>
          <IconButton
            id="home-icon"
            edge="start"
            color="inherit"
            aria-label="home"
          >
            <HomeIcon />
          </IconButton>
        </Link>

        {data && (
          <div id="navbar-tabs">
            <Link to={"/projects"}>
              <Typography>Projects</Typography>
            </Link>
            <Link to={"/activity"}>
              <Typography>Activity</Typography>
            </Link>

            <Link to={"/insight"}>
              <Typography>Insight</Typography>
            </Link>
            <Link to={"/notes"}>
              <Typography>Notes</Typography>
            </Link>
          </div>
        )}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <InputBase placeholder="Search…" />

          <IconButton onClick={handleMenu} color="inherit">
            {data && <Avatar src={data.avatarUrl || ""} />}
          </IconButton>
          <AddProjectBtnComp />

          <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
            <Link to={"/profile"}>
              <MenuItem onClick={handleClose}>Profile</MenuItem>
            </Link>

            <MenuItem onClick={handleClose}>Settings</MenuItem>
            <MenuItem onClick={handleSignOut}>Logout</MenuItem>
          </Menu>
        </div>
      </Toolbar>
    </AppBar>
  );
}
