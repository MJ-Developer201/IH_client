import React from "react";
import { Button, Typography, Box } from "@mui/material";

export default function HomeScreen() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        backgroundImage: `url('https://source.unsplash.com/random')`,
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
          sx={{ margin: 1, backgroundColor: "#17A2B8" }}
          variant="contained"
          onClick={() => console.log("How It Works")}
        >
          How It Works
        </Button>
        <Button
          sx={{ margin: 1, backgroundColor: "#FFA500" }}
          variant="contained"
          onClick={() => console.log("Sign Out")}
        >
          Sign Out
        </Button>
      </Box>
    </Box>
  );
}
