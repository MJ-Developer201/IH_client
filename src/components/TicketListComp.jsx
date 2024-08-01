import React from "react";
import { useContext, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useTicketsQuery } from "../api/useTicketsQuery";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  Container,
} from "@mui/material";
import { OrganizationContext } from "../App";
import LoadingSpinner from "../components/LoadSpinner";
import BugReportIcon from "@mui/icons-material/BugReport";
import PsychologyAltIcon from "@mui/icons-material/PsychologyAlt";
import AssistantIcon from "@mui/icons-material/Assistant";
import WrapTextIcon from "@mui/icons-material/WrapText";
import { useUsersQuery } from "../api/useUsersQuery";

export default function TicketListComp() {
  const queryClient = useQueryClient();

  const [orgData, setOrgData] = useContext(OrganizationContext);
  const { projectId, ticketId } = useParams();
  const navigate = useNavigate();
  const [editingStatusTicketId, setEditingStatusTicketId] = useState(null);
  const [editingUserTicketId, setEditingUserTicketId] = useState(null);
  const [selectedUser, setSelectedUser] = useState("");

  //queryFn for all tickets
  const {
    isLoading: ticketsLoading,
    error: ticketsError,
    data: tickets,
  } = useTicketsQuery(orgData.id, projectId);

  // queryFn for all users
  const {
    isLoading: usersLoading,
    isError: usersError,
    data: users,
  } = useUsersQuery();

  // queryFn for updating assigned user for a ticket
  const mutation = useMutation({
    mutationFn: (data) =>
      axios.put(`http://127.0.0.1:3001/put-assigned-user/${data.ticketId}`, {
        assignedUser: data.assignedUser,
      }),
    onSuccess: () => {
      console.log("Mutation succeeded");
      queryClient.invalidateQueries(["tickets", "test"]);
    },
    onError: (error) => {
      console.log("Mutation failed with error:", error);
    },
  });

  // queryFn for updating a ticket's status
  const statusMutation = useMutation({
    mutationFn: (data) => {
      console.log("Status mutation is being called with data:", data);
      const url = `http://127.0.0.1:3001/status/${data.ticketId}`;
      return axios.put(url, { status: data.status });
    },

    onSuccess: () => {
      console.log("Status mutation succeeded");
      queryClient.invalidateQueries([
        "tickets",
        { orgId: orgData.id, projectId },
      ]);
    },

    onError: (error) => {
      console.log("Status mutation failed with error:", error);
    },
  });

  // start of return statement's
  if (ticketsLoading) return <LoadingSpinner />;

  if (usersLoading) {
    return <p style={{ marginTop: "5rem" }}>Loading users...</p>;
  }

  if (usersError) {
    console.log(usersError.message);
    return (
      <p style={{ marginTop: "5rem" }}>Error user error 2: {usersError}</p>
    );
  }

  if (ticketsError) {
    const { response } = ticketsError;
    if (response?.status === 404) {
      return (
        <p
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "90vh", // Adjust the height as needed
          }}
          variant="h5"
          component="h2"
        >
          No tickets found for this project.
        </p>
      );
    } else {
      return <p>Error: An unexpected error occurred.</p>;
    }
  }

  return (
    <Container sx={{ paddingTop: "5%", paddingBottom: "3%" }}>
      <Card>
        <TableContainer sx={{ marginBlock: "1.5rem" }}>
          <Table>
            <TableHead>
              <TableRow sx={{ marginBlock: "5rem" }}>
                <TableCell align="center" sx={{ textDecoration: "underline" }}>
                  Issue
                </TableCell>
                <TableCell align="center" sx={{ textDecoration: "underline" }}>
                  Description
                </TableCell>
                <TableCell align="center" sx={{ textDecoration: "underline" }}>
                  Type
                </TableCell>
                <TableCell align="center" sx={{ textDecoration: "underline" }}>
                  Priority
                </TableCell>
                <TableCell align="center" sx={{ textDecoration: "underline" }}>
                  Status
                </TableCell>
                <TableCell align="center" sx={{ textDecoration: "underline" }}>
                  Assign User
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tickets &&
                tickets.map((ticket) => (
                  <TableRow key={ticket.id}>
                    <TableCell align="center" sx={{ maxWidth: "16rem" }}>
                      <span
                        style={{
                          cursor: "pointer",
                          // textDecoration: "underline",
                        }}
                        onClick={() =>
                          navigate(
                            `/viewticket/${projectId}/${ticket.issue}/${ticket.id}`
                          )
                        }
                      >
                        {ticket.issue}
                      </span>
                    </TableCell>
                    <TableCell align="center" sx={{ maxWidth: "31rem" }}>
                      {ticket.description}
                    </TableCell>
                    <TableCell align="center">
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                        }}
                      >
                        {ticket.type === "Bug" && (
                          <BugReportIcon sx={{ color: "green" }} />
                        )}
                        {ticket.type === "Enhancement" && (
                          <PsychologyAltIcon sx={{ color: "blue" }} />
                        )}
                        {ticket.type === "Feature" && (
                          <AssistantIcon sx={{ color: "gold" }} />
                        )}
                        {ticket.type === "Refactor" && <WrapTextIcon />}
                        {ticket.type}
                      </div>
                    </TableCell>
                    <TableCell align="center">{ticket.priority}</TableCell>

                    <TableCell
                      align="center"
                      onClick={() => setEditingStatusTicketId(ticket.id)}
                      onMouseLeave={() => setEditingStatusTicketId(null)}
                      style={{ cursor: "pointer" }}
                      sx={{ cursor: "pointer" }}
                    >
                      {editingStatusTicketId === ticket.id ? (
                        <Select
                          fullWidth
                          value={ticket.status}
                          onChange={(e) => {
                            statusMutation.mutate({
                              ticketId: ticket.id,
                              status: e.target.value,
                            });
                            setEditingStatusTicketId(null); // Stop editing when a selection is made
                          }}
                          MenuProps={{
                            PaperProps: {
                              style: {
                                maxHeight: "150px", // Set the max height here
                                width: "10ch",
                              },
                            },
                          }}
                          sx={{ maxHeight: "2rem" }}
                        >
                          <MenuItem value="Pending">Pending</MenuItem>
                          <MenuItem value="In Progress">In Progress</MenuItem>
                          <MenuItem value="Complete">Complete</MenuItem>
                        </Select>
                      ) : (
                        ticket.status
                      )}
                    </TableCell>
                    <TableCell
                      align="center"
                      onClick={() => setEditingUserTicketId(ticket.id)}
                      onMouseLeave={() => setEditingUserTicketId(null)}
                      style={{ cursor: "pointer" }}
                      sx={{ cursor: "pointer" }}
                    >
                      {editingUserTicketId === ticket.id ? (
                        <Select
                          fullWidth
                          value={selectedUser}
                          onChange={(e) => {
                            const newUser = e.target.value;
                            setSelectedUser(newUser);
                            mutation.mutate({
                              ticketId: ticket.id,
                              assignedUser: e.target.value,
                            });
                            setEditingUserTicketId(null); // Stop editing when a selection is made
                          }}
                          MenuProps={{
                            PaperProps: {
                              style: {
                                maxHeight: "50px", // Set the max height here
                                width: "10ch",
                              },
                            },
                          }}
                          sx={{ maxHeight: "2rem" }}
                        >
                          {users.map((user) => (
                            <MenuItem key={user.uid} value={user.username}>
                              {user.username}
                            </MenuItem>
                          ))}
                        </Select>
                      ) : (
                        ticket.assignedUser
                      )}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Container>
  );
}
