import React, { useContext, useState } from "react";
import {
  Button,
  TextField,
  FormControl,
  Box,
  Container,
  Snackbar,
  Alert,
  Card,
  CardContent,
  CardHeader,
  Typography,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { OrganizationContext } from "../App";
import { getToken } from "../functions/getStorageToken";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

export default function InviteComp() {
  const [email, setEmail] = useState("");
  const [organizationId, setOrganizationId] = useContext(OrganizationContext);
  const accessToken = getToken();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("info");
  const localPort = import.meta.env.VITE_LOCAL_PORT;
  const organizationUID = organizationId.id;

  const inviteUserMutation = useMutation({
    mutationFn: () =>
      axios.post(
        `http://127.0.0.1:${localPort}/send-invitation`,
        { email, organizationUID },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      ),
    onSuccess: () => {
      setSnackbarMessage("Invitation sent successfully!");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
      setEmail(""); // Reset email field after successful invite
    },
    onError: (error) => {
      console.error("Error inviting user:", error);
      // Check if the error object has a response field with more details
      if (error.response && error.response.data) {
        console.error("Detailed error:", error.response.data);
        // Use a more specific error message if available
        setSnackbarMessage(
          `Failed to send invitation: ${
            error.response.data.message || "Please try again."
          }`
        );
      } else {
        // Fallback to a generic error message
        setSnackbarMessage("Failed to send invitation. Please try again.");
      }
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    },
  });

  const handleEmailChange = (event) => setEmail(event.target.value);

  const handleInvite = () => {
    console.log(organizationId.id);
    console.log(accessToken);
    inviteUserMutation.mutateAsync();
  };

  const handleCloseSnackbar = () => setOpenSnackbar(false);

  return (
    <Container sx={{ paddingTop: "5%", paddingBottom: "3%" }}>
      <Card sx={{ maxWidth: 500, margin: "auto" }}>
        <CardHeader
          avatar={<PersonAddIcon />}
          title="Invite User"
          subheader="Send an invitation to join your organization"
        />
        <CardContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <FormControl sx={{ width: "100%", mb: 2 }}>
              <TextField
                autoFocus
                margin="dense"
                id="email"
                label="User Email"
                type="email"
                variant="outlined"
                value={email}
                onChange={handleEmailChange}
                fullWidth
              />
            </FormControl>

            <Button
              variant="contained"
              color="primary"
              onClick={handleInvite}
              disabled={inviteUserMutation.isLoading}
              sx={{ width: "100%" }}
            >
              Invite
            </Button>
          </Box>
        </CardContent>
      </Card>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
}
