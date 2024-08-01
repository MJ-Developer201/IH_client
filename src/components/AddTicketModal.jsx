import React, { useState, useContext } from "react";
import {
  Button,
  Grid,
  TextField,
  Dialog,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import { useAddTicketMutation } from "../api/useAddTicketMutation";
import { CustomAlert } from "./CustomNotification";
import { OrganizationContext, ProfileContext } from "../App";
import { useProjectsQuery } from "../api/useProjectsQuery";

export default function AddTicketModal({
  open,
  handleClose,
  successNotification,
}) {
  const [ticketTitle, setTicketTitle] = useState("");
  const [ticketDescription, setTicketDescription] = useState("");
  const [priority, setPriority] = useState("");
  const [status, setStatus] = useState("");
  const [type, setType] = useState("");
  const [assignedUser, setAssignedUser] = useState("");
  const [alert, setAlert] = useState({ message: "", severity: "" });
  const [orgData] = useContext(OrganizationContext);
  const [successMessage, setSuccessMessage] = useState("");
  const profileData = useContext(ProfileContext);
  const [selectedProjectId, setSelectedProjectId] = useState("");

  const addTicketMutation = useAddTicketMutation();

  //query for projects
  const {
    isLoading,
    error,
    data: projectsArray,
  } = useProjectsQuery(orgData?.id);

  console.log(orgData);
  // ENUM options
  const priorities = ["Low", "Med", "High"];
  const statuses = ["Pending", "In Progress", "Complete"];
  const types = ["Bug", "Feature", "Enhancement", "Refactor"];

  const handleSaveTicket = () => {
    successNotification("");
    setAlert({ message: "", severity: "" });

    const newTicket = {
      issue: ticketTitle,
      description: ticketDescription,
      priority,
      status,
      type,
      assignedUser,
      createdBy: profileData.username,
      projectId: selectedProjectId,
      organizationId: orgData.id, // Assuming orgData contains an id field
    };

    addTicketMutation.mutate(newTicket, {
      onSuccess: () => {
        successNotification("Ticket added successfully");
        handleClose();
      },
      onError: (error) => {
        setAlert({ message: "Error saving data", severity: "error" });
      },
    });
  };
  const handleProjectChange = (event) => {
    setSelectedProjectId(event.target.value);
  };
  console.log(selectedProjectId);
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Project</InputLabel>
              <Select
                value={selectedProjectId}
                label="Project"
                onChange={(e) => setSelectedProjectId(e.target.value)}
              >
                {projectsArray &&
                  projectsArray.map((project) => (
                    <MenuItem value={project.id} key={project.id}>
                      {project.projectName}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Ticket Title"
              fullWidth
              value={ticketTitle}
              onChange={(e) => setTicketTitle(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Ticket Description"
              fullWidth
              rows={4}
              value={ticketDescription}
              onChange={(e) => setTicketDescription(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Priority</InputLabel>
              <Select
                value={priority}
                label="Priority"
                onChange={(e) => setPriority(e.target.value)}
              >
                {priorities.map((priority) => (
                  <MenuItem key={priority} value={priority}>
                    {priority}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={status}
                label="Status"
                onChange={(e) => setStatus(e.target.value)}
              >
                {statuses.map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Type</InputLabel>
              <Select
                value={type}
                label="Type"
                onChange={(e) => setType(e.target.value)}
              >
                {types.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Assigned User"
              fullWidth
              value={assignedUser}
              onChange={(e) => setAssignedUser(e.target.value)}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSaveTicket}>
          Save Ticket
        </Button>
      </DialogActions>
      <CustomAlert message={alert.message} severity={alert.severity} />
    </Dialog>
  );
}
