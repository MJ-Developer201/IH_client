import React, { useContext, useEffect } from "react";
import { useUserQuery } from "../api/useUserQuery";
import { getToken } from "../functions/getStorageToken";
import { PhotoUrlContext, UserContext } from "../App";
import LoadingSpinner from "./LoadSpinner";
import EditProfileModal from "./EditProfileModal";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Container,
  Divider,
  Grid,
  TextField,
  Modal,
} from "@mui/material";
import { ProfileContext } from "../App";

export default function UserProfileComponent() {
  const accessToken = getToken();
  const [userId] = useContext(UserContext);
  const [userPhotoUrl, setUserPhotoUrl] = useContext(PhotoUrlContext);
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const { isLoading, error, data } = useUserQuery(userId, accessToken);
  // console.log(data);

  // useEffect(() => {
  //   if (data && data.avatarUrl) {
  //     setUserPhotoUrl(data.avatarUrl);
  //   }
  // }, [data]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <Container sx={{ paddingTop: "3%", paddingBottom: "3%" }}>
      <Card elevation={1}>
        <Grid
          container
          justifyContent="space-between"
          alignItems="center"
          sx={{ padding: "0.3rem" }}
        >
          <Grid>
            <CardHeader title="Profile" />
          </Grid>
          <Grid
            item
            xs={12}
            sm={6}
            sx={{ display: "flex", justifyContent: "flex-end" }}
          >
            <CardActions>
              <Button
                variant="contained"
                name="btnAddMore"
                onClick={handleOpen}
              >
                Edit Profile
              </Button>
            </CardActions>
          </Grid>
        </Grid>
        <Divider />
        <CardContent>
          <Grid container spacing={6}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Name"
                value={data?.username || ""}
                fullWidth
                disabled
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Age"
                value={data?.age || ""}
                fullWidth
                disabled
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Bio"
                value={data?.bio || ""}
                multiline
                disabled
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Email"
                value={data?.email || ""}
                fullWidth
                disabled
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Position"
                value={data?.position || ""}
                fullWidth
                disabled
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Location"
                value={data?.location || ""}
                fullWidth
                disabled
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <Modal open={open} onClose={handleClose}>
        <div>
          <EditProfileModal handleClose={handleClose} />
        </div>
      </Modal>
    </Container>
  );
}
