import React, { useContext, useState } from "react";
import axios from "axios";
import { getToken } from "../functions/getStorageToken";
import { useQueryClient } from "@tanstack/react-query";
import { UserContext } from "../App";
import {
  Box,
  Button,
  List,
  ListItem,
  Snackbar,
  Alert,
  Typography,
} from "@mui/material";
import { useInvitesQuery } from "../api/useInvitesQuery";

const localPort = import.meta.env.VITE_LOCAL_PORT;

export default function AcceptInvitesComp() {
  const queryClient = useQueryClient();
  const [userId] = useContext(UserContext);
  const { data: invitesData, isLoading, error } = useInvitesQuery(userId);
  const accessToken = getToken();
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const handleAcceptInvite = async (invite) => {
    try {
      await axios.post(
        `http://127.0.0.1:${localPort}/accept-invite`,
        { userId, organizationId: invite.organizationId },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      queryClient.invalidateQueries(["user", userId]);
      setSnackbar({
        open: true,
        message: "Invitation accepted successfully!",
        severity: "success",
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.response?.data?.message || "Failed to accept invitation.",
        severity: "error",
      });
    }
  };

  if (isLoading)
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "70vh",
        }}
      >
        <Typography>Loading...</Typography>
      </Box>
    );

  if (error) {
    const errorMessage =
      error.response?.status === 404
        ? "No invites found"
        : `Error: ${error.message}`;
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
        }}
      >
        <Typography>{errorMessage}</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
      }}
    >
      <List sx={{ width: "100%", maxWidth: 600 }}>
        {invitesData &&
          invitesData.map((invite, index) => (
            <ListItem
              key={index}
              sx={{
                mb: 2,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Typography variant="h6" gutterBottom>
                Invite from: {invite.organization.name}
              </Typography>
              <Typography
                variant="body1"
                color="textSecondary"
                sx={{ mb: 1, textAlign: "center" }}
              >
                {invite.organization.description}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleAcceptInvite(invite)}
              >
                Accept
              </Button>
            </ListItem>
          ))}
      </List>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
      >
        <Alert
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
