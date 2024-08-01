import React, { useContext, useState } from "react";
import { Button, Typography, Box } from "@mui/material";
import { AuthContext, UserContext } from "../App";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { signOut } from "aws-amplify/auth";
import AddProjectModal from "../components/AddProjectModal";
import { useAddProjectMutation } from "../api/useAddProjectMutation";
import { CustomAlert } from "../components/CustomNotification";

export default function HomeScreen() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [signedIn, setSignedIn] = useContext(AuthContext);
  const [userId, setUserId] = useContext(UserContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const addProjectMutation = useAddProjectMutation();

  async function handleSignOut() {
    try {
      await signOut();
      setUserId(null);
      localStorage.removeItem("accessToken");
      console.log("User Signed Out");
      setSignedIn(false);
      queryClient.removeQueries();
      navigate("/signin");
    } catch (error) {
      console.log("error signing out: ", error);
    }
  }

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          backgroundImage: `url('../../public/pexels-jem-sanchez-1108814.jpg')`,
          backgroundSize: "cover",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.2)",
            padding: 2,
            borderRadius: 1,
          }}
        >
          <Typography
            sx={{
              fontSize: 32,
              fontWeight: "bold",
              color: "white",
              marginBottom: 2,
            }}
            variant="h1"
          >
            Welcome to Issue-Hold
          </Typography>
          <Typography
            sx={{
              fontSize: 20,
              color: "white",
              marginBottom: 3,
              textAlign: "center",
            }}
            variant="h2"
          >
            Track and manage bugs in your projects
          </Typography>

          <Button
            color="primary"
            sx={{ margin: 1 }}
            variant="contained"
            onClick={handleOpenModal} // Use handleOpenModal for opening the modal
          >
            + Project
          </Button>
          <Button
            color="secondary"
            sx={{ margin: 1 }}
            variant="contained"
            onClick={handleSignOut}
          >
            Sign Out
          </Button>
        </Box>
      </Box>
      {isModalOpen && (
        <AddProjectModal
          open={isModalOpen}
          handleClose={handleCloseModal}
          successNotification={setSuccessMessage}
        />
      )}
      {successMessage && (
        <CustomAlert severity="success" message={successMessage} />
      )}

      {addProjectMutation.isError && (
        <CustomAlert
          severity="error"
          message={addProjectMutation.error.message}
        />
      )}
    </>
  );
}
