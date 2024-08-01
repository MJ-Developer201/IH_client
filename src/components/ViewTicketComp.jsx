import React, { useContext } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Container,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { useQueryClient, useQuery } from "@tanstack/react-query";

// import AddTicketButton from "../components/AddTicketButton";
// import IndividualTicket from "../components/IndividualTicket";
// import IndividualComments from "../components/IndividualComments";
// import AddCommentForm from "../components/AddCommentForm";
import { Add } from "@mui/icons-material";
import axios from "axios";
import { useTicketsQuery } from "../api/useTicketsQuery";
import LoadingSpinner from "../components/LoadSpinner";
import { useUsersQuery } from "../api/useUsersQuery";
import { OrganizationContext } from "../App";

export default function ViewTicketComp() {
  const { projectId, ticketId } = useParams();
  const queryClient = useQueryClient();
  const [orgData, setOrgData] = useContext(OrganizationContext);
  const projectData = queryClient.getQueryData(["projects", projectId]);

  const {
    isLoading: ticketsLoading,
    error: ticketsError,
    data: tickets,
  } = useTicketsQuery(orgData.id, projectId);

  //
  // const allTicketsData = queryClient.getQueryData(["tickets"]);
  // const ticketData = allTicketsData.find(
  //   (ticket) => ticket.id === parseInt(ticketId)
  // );
  if (ticketsLoading) return <LoadingSpinner />;

  if (ticketsError) {
    console.log(ticketsError.message);
    return <p>Error: {ticketsError.message}</p>;
  }

  // Format the creation and update time
  // const createdAtTime = new Date(ticket.createdAt).toLocaleTimeString([], {
  //   hour: "numeric",
  //   minute: "2-digit",
  // });
  // const updatedAtTime = new Date(ticket.updatedAt).toLocaleTimeString([], {
  //   hour: "numeric",
  //   minute: "2-digit",
  // });

  const ticket =
    tickets && tickets.find((ticket) => ticket.id.toString() === ticketId);

  console.log(ticket);

  return (
    <Container sx={{ paddingTop: "5%", paddingBottom: "3%" }}>
      <Grid
        container
        spacing={2}
        style={{ display: "flex", alignItems: "stretch" }}
      >
        <Grid item xs={12} sm={8} style={{ display: "flex" }}>
          <Card
            elevation={1}
            style={{ flex: 1, display: "flex", flexDirection: "column" }}
          >
            <CardContent style={{ flex: 1 }}>
              <Typography style={{ fontSize: "1.5rem" }} gutterBottom>
                {ticket && ticket.issue}
              </Typography>
              {/* <Typography sx={{ paddingLeft: "1rem" }} variant="body1">
                <b>Username: </b>
                {data?.username || ""}
              </Typography> */}
              <Typography variant="body1" gutterBottom>
                <b> Description: </b>

                {ticket && ticket.description}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card elevation={1}>
            <CardContent>
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <Typography variant="body2" gutterBottom>
                    <b> Assigned User: </b> {ticket && ticket.assignedUser}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    <b> Type: </b> {ticket && ticket.type}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    <b> Priority: </b> {ticket && ticket.priority}
                  </Typography>
                  <Typography variant="body2">
                    <b> Status: </b>
                    {ticket && ticket.status}
                  </Typography>
                </Grid>
                {/* <Grid item xs={6}>
                <Typography variant="body2" gutterBottom>
                  Created At: {createdAtTime}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  Updated At: {updatedAtTime}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  Created By: {ticket.createdBy}
                </Typography>
              </Grid> */}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
