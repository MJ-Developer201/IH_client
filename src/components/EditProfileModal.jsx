import React, { useState, useContext } from "react";
import {
  Avatar,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
} from "@mui/material";
import { getUrl, uploadData } from "aws-amplify/storage";
import { PhotoUrlContext } from "../App";
import { UserContext, ProfileContext } from "../App";
import axios from "axios";
import { getToken } from "../functions/getStorageToken";
import { useQuery } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { CustomAlert } from "./CustomNotification";
import { useUserMutation } from "../api/useUserMutation";

export default function EditProfileModal({ handleClose, setAlert }) {
  const [file, setFile] = useState(null);
  const [userId, setUserId] = useContext(UserContext);
  const data = useContext(ProfileContext);
  const [userPhotoUrl, setUserPhotoUrl] = useContext(PhotoUrlContext);
  const updateUrl = import.meta.env.VITE_USER_UPDATE_API;
  const photoBucketName = import.meta.env.VITE_PHOTO_BUCKET_NAME;
  const localPort = import.meta.env.VITE_LOCAL_PORT;
  const region = import.meta.env.VITE_REGION;
  const updatePhotoUrl = import.meta.env.VITE_USER_PHOTO_API;
  const accessToken = getToken();
  const queryClient = useQueryClient();
  const userMutation = useUserMutation(userId);
  const [username, setUsername] = useState(data ? data.username : "");
  const [age, setAge] = useState(data ? data.age : "");
  const [bio, setBio] = useState(data ? data.bio : "");
  const [email, setEmail] = useState(data ? data.email : "");
  const [position, setPosition] = useState(data ? data.position : "");
  const [location, setLocation] = useState(data ? data.location : "");

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpdatePhoto = async () => {
    console.log("Starting file upload...");

    if (!file) {
      console.log("No file selected");
      alert("No file selected");
      return;
    }

    try {
      console.log(
        "Preparing to upload file to path:",
        `public/${userId}/${file.name}`
      );
      const result = await uploadData({
        path: `public/${userId}/${file.name}`,
        data: file,
      });

      const getUrlResult = await getUrl({
        path: `public/${userId}/${file.name}`,
        options: {
          level: "public", // or 'protected' or 'private', depending on your needs
          download: false,
          cacheControl: "no-cache",
        },
      });

      const fileUrl = `https:/${photoBucketName}.s3.amazonaws.com${getUrlResult.url.pathname}`;
      // setUserPhotoUrl(fileUrl);

      console.log(fileUrl);

      const response = await axios.post(
        `http://127.0.0.1:${localPort}/${updatePhotoUrl}`,
        { avatarUrl: fileUrl },
        {
          headers: {
            "Content-Type": "application/json   ",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      queryClient.invalidateQueries(["user", userId], { force: true });
      console.log(
        "Successfully updated avatar URL in the backend:",
        response.data
      );

      alert("File uploaded successfully");
    } catch (error) {
      console.error("Error occurred during file upload:", error);
      alert(`Error uploading file: ${error.message}`);
    }
  };

  // save profile data function
  const handleSaveData = async () => {
    console.log("attemting to save");
    const updateFields = {
      username: username,
      age: age,
      bio: bio,
      email: email,
      position: position,
      location: location,
    };
    userMutation.mutate(updateFields, {
      onSuccess: () => {
        console.log("success");
        setAlert({ message: "Data saved successfully", severity: "success" });
        handleClose();
      },
      onError: () => {
        console.log(error.message);
        setAlert({ message: "Error saving data,", severity: "error" });
      },
    });
  };

  return (
    <Card sx={{ padding: "2rem", margin: "2rem" }}>
      <Avatar
        src={data.avatarUrl || ""}
        sx={{ width: 56, height: 56, margin: "0 auto" }}
      >
        {data && data.username.charAt(0).toUpperCase()}
      </Avatar>
      <CardContent>
        <Grid container spacing={6}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Name"
              defaultValue={data ? data.username : ""}
              fullWidth
              onChange={(e) => setUsername(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Age"
              defaultValue={data ? data.age : ""}
              fullWidth
              onChange={(e) => setAge(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Bio"
              defaultValue={data ? data.bio : ""}
              multiline
              onChange={(e) => setBio(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Email"
              defaultValue={data ? data.email : ""}
              fullWidth
              onChange={(e) => setEmail(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Position"
              defaultValue={data ? data.position : ""}
              fullWidth
              onChange={(e) => setPosition(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Location"
              defaultValue={data ? data.location : ""}
              fullWidth
              onChange={(e) => setLocation(e.target.value)}
            />
          </Grid>
        </Grid>
        {/* <Grid>
          <TextField
            style={{ marginTop: "2em" }}
            type="file"
            onChange={handleFileChange}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>
        <Grid paddingTop={"0.5rem"}>
          <Button onClick={handleUpdatePhoto} variant="text">
            Update Photo
          </Button>
        </Grid> */}
        <Grid
          container
          spacing={2}
          justifyContent="flex-end"
          sx={{ marginTop: "1rem" }}
        >
          <Grid item>
            <Button variant="outlined" onClick={handleClose}>
              Cancel
            </Button>
          </Grid>
          <Grid item>
            <Button variant="contained" onClick={handleSaveData}>
              Save Changes
            </Button>
          </Grid>
        </Grid>
      </CardContent>
      <CustomAlert message={alert.message} severity={alert.severity} />
    </Card>
  );
}
