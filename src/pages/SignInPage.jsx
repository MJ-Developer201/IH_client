import React, { useState, useContext } from "react";
import { TextField, Button, Box } from "@mui/material";
import { AuthContext, UserContext } from "../App";
import { signIn, signOut } from "aws-amplify/auth";
import { fetchAuthSession } from "aws-amplify/auth";
import { getCurrentUser } from "aws-amplify/auth";
import { useNavigate } from "react-router";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signedIn, setSignedIn] = useContext(AuthContext);
  const [userId, setUserId] = useContext(UserContext);
  const navigate = useNavigate();
  const demoEmail = import.meta.env.VITE_DEMO_USERNAME;
  const demoPasswrd = import.meta.env.VITE_DEMO_PASSWRD;

  async function handleSignIn() {
    try {
      const { username, attributes } = await signIn({
        username: email,
        password,
      });
      setSignedIn(true);
      const { accessToken, idToken } = (await fetchAuthSession()).tokens ?? {};
      console.log(accessToken);
      localStorage.setItem("accessToken", accessToken);
      const { userId } = await getCurrentUser();
      console.log(userId);
      setUserId(userId);
      navigate("/profile");
    } catch (error) {
      console.log("error signing in", error);
    }
  }

  async function handleDemoUser() {
    try {
      const { username } = await signIn({
        username: demoEmail,
        password: demoPasswrd,
      });
      setSignedIn(true);
      const { accessToken, idToken } = (await fetchAuthSession()).tokens ?? {};
      // console.log(accessToken);
      localStorage.setItem("accessToken", accessToken);
      const user = idToken.payload;
      // console.log(user.sub);
      setUserId(user.sub);
      setSignedIn(true);
      navigate("/profile");
    } catch (error) {
      console.log("error signing in", error.message);
    }
  }

  async function handleSignOut() {
    try {
      await signOut();
      console.log("User Signed Out");
      setSignedIn(false);
    } catch (error) {
      console.log("error signing out: ", error);
    }
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        marginTop: "-5rem",
      }}
    >
      <img
        src="../../public/Add a heading (13).png"
        alt="Logo"
        style={{ margin: "-12rem" }}
      />

      <TextField
        label="Username"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        variant="filled"
        sx={{ marginBottom: "16px" }}
      />

      <TextField
        label="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        type="password"
        variant="filled"
        sx={{ marginBottom: "16px" }}
      />
      <Button
        variant="contained"
        onClick={handleSignIn}
        sx={{ marginTop: "16px" }}
      >
        Sign In
      </Button>

      <Button
        variant="outlined"
        onClick={handleDemoUser}
        sx={{ marginTop: "16px" }}
      >
        Demo
      </Button>

      <Button
        variant="outlined"
        onClick={handleSignOut}
        sx={{ marginTop: "16px" }}
      >
        Sign Out
      </Button>
    </Box>
  );
}
