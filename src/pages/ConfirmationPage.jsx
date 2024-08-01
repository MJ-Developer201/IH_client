import React, { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Avatar,
  Typography,
  Container,
  CssBaseline,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router";
import { confirmSignUp } from "aws-amplify/auth";

const defaultTheme = createTheme();

export default function ConfirmationPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    confirmationCode: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await confirmSignUp({
        username: formData.username,
        confirmationCode: formData.confirmationCode,
      });
      console.log("Sign up confirmation successful");
      navigate("/signin"); // Redirect to sign-in page on successful confirmation
    } catch (error) {
      console.log("error confirming sign up", error);
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
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
          <Avatar sx={{ m: 1, bgcolor: "success.main" }}>
            <CheckCircleOutlineIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Confirm Your Email
          </Typography>
          <Typography variant="body2" sx={{ mt: 2 }}>
            A confirmation code has been sent to your email. Please enter the
            6-digit code below to confirm your account.
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Email Address"
              name="username"
              autoComplete="email"
              autoFocus
              onChange={handleChange}
              value={formData.username}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmationCode"
              label="Confirmation Code"
              type="text"
              id="confirmationCode"
              autoComplete="one-time-code"
              onChange={handleChange}
              value={formData.confirmationCode}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Confirm
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
