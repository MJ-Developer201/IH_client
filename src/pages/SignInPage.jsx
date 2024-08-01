import * as React from "react";
import { useState, useContext } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { AuthContext, UserContext } from "../App"; // Assuming these contexts are defined in App.js
import {
  signIn,
  signOut,
  fetchAuthSession,
  getCurrentUser,
} from "aws-amplify/auth";
import { useNavigate } from "react-router-dom"; // Assuming react-router-dom is used for navigation

// Assuming the existence of demo credentials as environment variables

export default function SignIn() {
  const [email, setEmail] = useState("testaccount");
  const [password, setPassword] = useState("testpassword");
  const [signedIn, setSignedIn] = useContext(AuthContext);
  const [userId, setUserId] = useContext(UserContext);
  const navigate = useNavigate();
  const demoEmail = import.meta.env.VITE_DEMO_USERNAME;
  const demoPassword = import.meta.env.VITE_DEMO_PASSWRD;

  async function handleDemoUser() {
    try {
      const { username } = await signIn({
        username: demoEmail,
        password: demoPassword,
      });
      const { accessToken, idToken } = (await fetchAuthSession()).tokens ?? {};
      // console.log(accessToken);
      localStorage.setItem("accessToken", accessToken);
      const user = idToken.payload;
      // console.log(user.sub);
      setUserId(user.sub);
      setSignedIn(true);

      navigate("/");
    } catch (error) {
      console.log("error signing in", error.message);
    }
  }

  async function handleSignIn() {
    try {
      const { username } = await signIn({
        username: demoEmail,
        password: demoPassword,
      });

      const { accessToken, idToken } = (await fetchAuthSession()).tokens ?? {};
      console.log(accessToken);
      localStorage.setItem("accessToken", accessToken);
      const user = idToken.payload;
      // const { userId } = await getCurrentUser();
      console.log(userId);

      setUserId(user.sub);
      setSignedIn(true);
      // setUserId(userId);
      navigate("/");
    } catch (error) {
      console.log("error signing in", error.message);
    }
  }

  // Removed the theme resetting for brevity
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div onClick={handleDemoUser}>
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
        </div>
        <Typography component="h1" variant="h5">
          Issue-Hold
        </Typography>
        <Box component="form" noValidate sx={{ mt: 1 }}>
          <TextField
            disabled
            margin="normal"
            required
            fullWidth
            type="password"
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            disabled
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
          {/* <div>
            <Button
              onClick={handleSignIn}
              disabled
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
          </div> */}
          <div onClick={handleDemoUser}>
            <Button fullWidth variant="contained" sx={{ mt: 2, mb: 2 }}>
              DEMO
            </Button>
          </div>
          <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link href="signup" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}
