import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Grid,
  Card,
  CardHeader,
  IconButton,
  CardContent,
  Tooltip,
  Typography,
  Container,
} from "@mui/material";
import { DeleteOutlineOutlined, EditOutlined } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
// import { config } from "../utilities/getToken";
import LoadingSpinner from "./LoadSpinner";
import { OrganizationContext, ProjectsContext } from "../App";
import { useProjectsQuery } from "../api/useProjectsQuery";
import { getToken } from "../functions/getStorageToken";

const fetchProjects = async () => {
  const response = await axios.get("http://127.0.0.1:3001/project");
  return response.data;
};

export default function ProjectsListComp() {
  const [orgData, setOrgData] = useContext(OrganizationContext);
  const queryClient = useQueryClient();
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const accessToken = getToken();
  const [projectId, setProjectId] = useContext(ProjectsContext);

  const { isLoading, error, data: projects } = useProjectsQuery(orgData?.id);

  useEffect(() => {
    if (projects && projects.length > 0) {
      setProjectId(projects[0].id);
    }
  }, [projects]);

  const handleDeleteProject = async (projectId) => {
    try {
      const orgId = orgData.id;
      // Use the accessToken for authorization in the request header
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      };
      await axios.delete(
        `http://127.0.0.1:3001/project/${orgId}/${projectId}`,
        config
      );
      queryClient.invalidateQueries(["projects", orgId]);
    } catch (error) {
      console.error(
        "An error occurred while deleting the project:",
        error.message
      );
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    const errorMessage =
      error.response && error.response.status === 404
        ? "No Project created for this organization"
        : `Error: ${error.message || "Something went wrong"}`;
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        {errorMessage}
      </div>
    );
  }

  if (!projects || projects.length === 0) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          textAlign: "center",
        }}
      >
        <Typography variant="h5">No projects have been created yet.</Typography>
      </div>
    );
  }

  return (
    <Container
      style={{
        paddingTop: "5%",

        marginLeft: "3%",
      }}
    >
      <Grid container spacing={2}>
        {projects?.map((project) => (
          <Grid
            item
            xs={12}
            md={6}
            lg={6}
            key={project.id}
            className="projects-list-grid"
          >
            <motion.div whileHover={{ scale: 1.02 }}>
              <Card elevation={3}>
                <CardHeader
                  action={
                    <>
                      {/* <Tooltip title="Edit">
                        <IconButton
                          onClick={() => setSelectedProjectId(project.id)}
                        >
                          <EditOutlined />
                        </IconButton>
                      </Tooltip> */}
                      <Tooltip title="Delete">
                        <IconButton
                          onClick={() => handleDeleteProject(project.id)}
                        >
                          <DeleteOutlineOutlined />
                        </IconButton>
                      </Tooltip>
                    </>
                  }
                  titleTypographyProps={{
                    fontSize: "1.3rem",
                    color: "#333333",
                    fontFamily: "inherit",
                  }}
                  title={
                    <Link
                      style={{ textDecoration: "none", color: "#333333" }}
                      to={`/project/${project.id}`}
                    >
                      <motion.div whileHover={{ color: "#2b6f83" }}>
                        {project.projectName}
                      </motion.div>
                    </Link>
                  }
                />
                <CardContent>
                  <Typography variant="body2" color={"textSecondary"}>
                    {project.projectDescription}
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
