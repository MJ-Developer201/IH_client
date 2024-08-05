import React, { useContext, useEffect, useState } from "react";
import { useUserQuery } from "../api/useUserQuery";
import { getToken } from "../functions/getStorageToken";
import { PhotoUrlContext, UserContext, OrganizationContext } from "../App";
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
  Typography,
} from "@mui/material";
import { ProfileContext } from "../App";
import { Avatar, Badge } from "@mui/material";
import { PhotoCamera } from "@mui/icons-material";
import StyledBadge from "./StyledBadge";
import PersonIcon from "@mui/icons-material/Person";
import DataUsageIcon from "@mui/icons-material/DataUsage";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import FingerprintIcon from "@mui/icons-material/Fingerprint";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import GroupsIcon from "@mui/icons-material/Groups";
import PublicIcon from "@mui/icons-material/Public";
import ProfilePictureModal from "./ProfilePictureModal";
import { CustomAlert } from "./CustomNotification";
import { useOrgRedirect } from "../api/useOrgRedirect";
import DomainOutlinedIcon from "@mui/icons-material/DomainOutlined";

//
export default function UserProfileComponent() {
  const accessToken = getToken();
  const [userId] = useContext(UserContext);
  const [userPhotoUrl, setUserPhotoUrl] = useContext(PhotoUrlContext);
  const [open, setOpen] = React.useState(false);
  const [openImgModal, setOpenImgModal] = useState(false);
  const [orgdata, setOrgData] = useContext(OrganizationContext);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleCloseImgModal = () => setOpenImgModal(false);
  const [alert, setAlert] = useState({ message: "", severity: "" });
  const data = useContext(ProfileContext);

  // const { isLoading, error, data } = useUserQuery(userId, accessToken);

  // useOrgRedirect(isLoading, data);

  // if (isLoading) {
  //   return <LoadingSpinner />;
  // }

  // if (error) {
  //   return <div>Error: {error.message}</div>;
  // }

  return (
    <Container sx={{ paddingTop: "5%", paddingBottom: "3%" }}>
      <Card elevation={1}>
        <Grid
          container
          justifyContent="space-between"
          alignItems="center"
          sx={{ padding: "0.3rem" }}
        >
          <Grid>
            <CardHeader
              avatar={
                <StyledBadge
                  onClick={() => setOpenImgModal(true)}
                  overlap="circular"
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  badgeContent={
                    <PhotoCamera
                      sx={{
                        maxWidth: "1.1rem",
                        maxHeight: "1.1rem",
                        color: "white",
                        "&:hover": {
                          // color: "red",
                          // background: "red",
                        },
                      }}
                    />
                  }
                >
                  <Avatar
                    sx={{
                      width: "80px",
                      height: "80px",
                      // "&:hover": {
                      //   backgroundColor: `white`,
                      // },
                    }}
                    src={data?.avatarUrl || ""}
                  >
                    {data && data.username.charAt(0).toUpperCase()}
                  </Avatar>
                </StyledBadge>
              }
            />
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
            <Grid display={"flex"} item xs={12} sm={6}>
              <PersonIcon />
              <Typography sx={{ paddingLeft: "1rem" }} variant="body1">
                <b>Username: </b>
                {data?.username || ""}
              </Typography>
            </Grid>
            <Grid display={"flex"} item xs={12} sm={6}>
              <AccessTimeIcon />
              <Typography sx={{ paddingLeft: "1rem" }} variant="body1">
                <b>Age: </b>
                {data?.age || ""}
              </Typography>
            </Grid>
            <Grid display={"flex"} item xs={12} sm={6}>
              <FingerprintIcon />
              <Typography sx={{ paddingLeft: "1rem" }} variant="body1">
                <b> Bio:</b> {data?.bio || ""}
                <br />
              </Typography>
            </Grid>
            <Grid display={"flex"} item xs={12} sm={6}>
              <MailOutlineIcon />
              <Typography sx={{ paddingLeft: "1rem" }} variant="body1">
                <b>Email:</b> {data?.email || ""}
              </Typography>
            </Grid>
            <Grid display={"flex"} item xs={12} sm={6}>
              <GroupsIcon />
              <Typography sx={{ paddingLeft: "1rem" }} variant="body1">
                <b>Position:</b> {data?.position || ""}
              </Typography>
            </Grid>
            <Grid display={"flex"} item xs={12} sm={6}>
              <PublicIcon />
              <Typography sx={{ paddingLeft: "1rem" }} variant="body1">
                <b>Location:</b> {data?.location || ""}
              </Typography>
            </Grid>
            <Grid display={"flex"} item xs={12} sm={6}>
              <DomainOutlinedIcon />
              <Typography sx={{ paddingLeft: "1rem" }} variant="body1">
                <b>Organization: </b> {orgdata.name || ""}
              </Typography>
            </Grid>
            {/* <Grid display={"flex"} item xs={12} sm={6}>
              <DomainOutlinedIcon />
              <Typography sx={{ paddingLeft: "1rem" }} variant="body1">
                <b>Project Id : </b> {data?.projectId || ""}
              </Typography>
            </Grid> */}
          </Grid>
        </CardContent>
      </Card>
      <Modal open={open} onClose={handleClose}>
        <div>
          <EditProfileModal setAlert={setAlert} handleClose={handleClose} />
        </div>
      </Modal>
      <Modal open={openImgModal} onClose={handleCloseImgModal}>
        <div>
          <ProfilePictureModal
            open={openImgModal}
            handleClose={handleCloseImgModal}
            setAlert={setAlert}
          />
        </div>
      </Modal>
      <CustomAlert message={alert.message} severity={alert.severity} />
    </Container>
  );
}
