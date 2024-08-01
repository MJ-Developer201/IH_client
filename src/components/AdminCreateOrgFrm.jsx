import React, { useState } from "react";
import {
  Button,
  TextField,
  Container,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Box,
} from "@mui/material";
import { useOrgMutation } from "../api/useOrgMutation";
import BusinessIcon from "@mui/icons-material/Business";

export default function AdminCreateOrgFrm() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const createOrgMutation = useOrgMutation();

  const handleSubmit = (event) => {
    event.preventDefault();
    createOrgMutation.mutate({ name, description });
  };

  return (
    <Container
      sx={{ paddingTop: "5%", paddingBottom: "3%" }}
      component="main"
      maxWidth="sm"
    >
      <Card sx={{ maxWidth: 500, margin: "auto" }}>
        <CardHeader
          avatar={<BusinessIcon />}
          title="Create Organization"
          subheader="Fill in the details to create a new organization"
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
            <form onSubmit={handleSubmit} style={{ width: "100%" }}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="name"
                label="Organization Name"
                name="name"
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                name="description"
                label="Description"
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                disabled={createOrgMutation.isLoading}
                sx={{ mt: 2 }}
              >
                {createOrgMutation.isLoading
                  ? "Creating..."
                  : "Create Organization"}
              </Button>
            </form>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}
