import React, { useState, useContext } from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  Grid,
  TextField,
  Avatar,
} from "@mui/material";
import { getUrl, uploadData } from "aws-amplify/storage";
import { UserContext } from "../App";
import axios from "axios";
import { getToken } from "../functions/getStorageToken";
import { useQueryClient } from "@tanstack/react-query";
import { ProfileContext } from "../App";
import { CustomAlert } from "./CustomNotification";

export default function ProfilePictureModal({ handleClose, open, setAlert }) {
  const [file, setFile] = useState(null);
  const [userId, setUserId] = useContext(UserContext);
  const updatePhotoUrl = import.meta.env.VITE_USER_PHOTO_API;
  const photoBucketName = import.meta.env.VITE_PHOTO_BUCKET_NAME;
  const localPort = import.meta.env.VITE_LOCAL_PORT;
  const accessToken = getToken();
  const queryClient = useQueryClient();
  const data = useContext(ProfileContext);

  const showAlert = (message, severity) => {
    setAlert({
      open: true,
      message,
      severity,
    });
  };

  const handleAlertClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setAlert({ ...alert, open: false });
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpdatePhoto = async () => {
    if (!file) {
      alert("No file selected");
      return;
    }

    try {
      const result = await uploadData({
        path: `public/${userId}/${file.name}`,
        data: file,
      });

      const getUrlResult = await getUrl({
        path: `public/${userId}/${file.name}`,
        options: {
          level: "public",
          download: false,
          cacheControl: "no-cache",
        },
      });

      const fileUrl = `https:/${photoBucketName}.s3.amazonaws.com${getUrlResult.url.pathname}`;

      const response = await axios.post(
        `http://127.0.0.1:${localPort}/${updatePhotoUrl}`,
        { avatarUrl: fileUrl },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      queryClient.invalidateQueries(["user", userId], { force: true });

      showAlert("File uploaded successfully", "success");

      handleClose();
    } catch (error) {
      showAlert(`Error uploading file: ${error.message}`, "error");
    }
  };

  return (
    <Dialog sx={{ marginTop: "-12rem" }} open={open} onClose={handleClose}>
      <DialogContent dividers>
        <Grid
          container
          spacing={6}
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <Grid
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
            item
            xs={12}
            sm={12}
          >
            <Avatar
              sx={{
                minHeight: "150px",
                minWidth: "150px",
                maxHeight: "200",
                maxWidth: "200px",
                marginBlock: "1rem",
              }}
              src={data.avatarUrl || ""}
              alt="Avatar"
            />
            <TextField
              type="file"
              fullWidth
              onChange={handleFileChange}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button variant="filled" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="outlined" onClick={handleUpdatePhoto}>
          Update Photo
        </Button>
      </DialogActions>
      <CustomAlert
        open={alert.open}
        handleClose={handleAlertClose}
        message={alert.message}
        severity={alert.severity}
      />
    </Dialog>
  );
}
