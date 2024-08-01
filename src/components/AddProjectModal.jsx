import React, { useState, useContext, useEffect } from "react";
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
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAddProjectMutation } from "../api/useAddProjectMutation";
import { CustomAlert } from "./CustomNotification";
import { OrganizationContext, ProfileContext, ProjectsContext } from "../App";
import { useProjectsQuery } from "../api/useProjectsQuery";

export default function AddProjectModal({
  handleClose,
  open,
  successNotification,
}) {
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState("");

  const [language, setLanguage] = useState("");
  const [framework, setFramework] = useState("");
  const [cloud, setCloud] = useState("");
  const [projectManager, setProjectManager] = useState("");
  const [client, setClient] = useState("");
  const [alert, setAlert] = useState({ message: "", severity: "" });
  const [orgData] = useContext(OrganizationContext);
  const navigate = useNavigate();
  const data = useContext(ProfileContext);
  const [projectsData, setProjectsData] = useContext(ProjectsContext);

  const addProjectMutation = useAddProjectMutation();
  // const {
  //   isLoading,
  //   error,
  //   data: projectsArray,
  // } = useProjectsQuery(orgData?.id);

  const handleProjectChange = (event) => {
    setSelectedProjectId(event.target.value);
  };

  // if (isLoading) return <div>Loading...</div>;
  // if (error) return <div>An error occurred: {error.message}</div>;

  // ENUM options
  const languages = ["JavaScript", "Python", "Java", "C#", "Ruby", "PHP"];
  const frameworks = [
    "React",
    "Angular",
    "Vue",
    "Express",
    "Django",
    "Ruby on Rails",
  ];
  const clouds = ["AWS", "Azure", "Google Cloud", "DigitalOcean", "Heroku"];

  console.log(data);

  const handleSaveProject = () => {
    successNotification("");
    setAlert({ message: "", severity: "" });
    console.log();

    const newProject = {
      projectName,
      projectDescription,
      language,
      framework,
      cloud,
      projectManager,
      client,

      organizationId: data.organizationId, // Assuming orgData contains an id field
    };
    console.log(newProject);
    addProjectMutation.mutate(newProject, {
      onSuccess: () => {
        successNotification("Project added successfully");
        handleClose();
      },
      onError: (error) => {
        setAlert({ message: "Error saving data", severity: "error" });
      },
    });
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Project Name"
              fullWidth
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Project Description"
              fullWidth
              rows={4}
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Language</InputLabel>
              <Select
                value={language}
                label="Language"
                onChange={(e) => setLanguage(e.target.value)}
              >
                {languages.map((lang) => (
                  <MenuItem key={lang} value={lang}>
                    {lang}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Framework</InputLabel>
              <Select
                value={framework}
                label="Framework"
                onChange={(e) => setFramework(e.target.value)}
              >
                {frameworks.map((fw) => (
                  <MenuItem key={fw} value={fw}>
                    {fw}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Cloud</InputLabel>
              <Select
                value={cloud}
                label="Cloud"
                onChange={(e) => setCloud(e.target.value)}
              >
                {clouds.map((cloud) => (
                  <MenuItem key={cloud} value={cloud}>
                    {cloud}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Project Manager"
              fullWidth
              value={projectManager}
              onChange={(e) => setProjectManager(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Client"
              fullWidth
              value={client}
              onChange={(e) => setClient(e.target.value)}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSaveProject}>
          Save Project
        </Button>
      </DialogActions>
      <CustomAlert message={alert.message} severity={alert.severity} />
    </Dialog>
  );
}
