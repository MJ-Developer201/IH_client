import React, { useContext, useState } from "react";
import {
  TextField,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TableHead,
  Container,
  Typography,
  Box,
} from "@mui/material";
import { UserContext } from "../App";
import { useAddNoteMutation } from "../api/useAddNoteMutation";
import { useNotesQuery } from "../api/useNotesQuery";
import DeleteIcon from "@mui/icons-material/Delete";
import EditNoteIcon from "@mui/icons-material/EditNote";
import NoteIcon from "@mui/icons-material/Note";
import { useDeleteNoteMutation } from "../api/useDeleteNote";
import { CustomAlert } from "./CustomNotification";
import EditNoteModal from "./EditNoteModal";

export default function NotesComp() {
  const [reference, setReference] = useState("");
  const [note, setNote] = useState("");
  const [userId, setUserId] = useContext(UserContext);
  const addNoteMutation = useAddNoteMutation();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [noteBeingEdited, setNoteBeingEdited] = useState(null);
  const [editSuccessMessage, setEditSuccessMessage] = useState("");
  const deleteNoteMutation = useDeleteNoteMutation();

  const handleAddNote = () => {
    addNoteMutation.mutate({ reference, note });
    setReference("");
    setNote("");
  };

  const handleDeleteNote = (id) => {
    deleteNoteMutation.mutate(id);
  };

  const handleEditNote = (note) => {
    setNoteBeingEdited(note);
    setIsEditModalOpen(true);
  };

  const { isLoading, error, data: notes } = useNotesQuery();

  return (
    <Container
      sx={{ paddingTop: "5%", paddingBottom: "3%" }}
      component="main"
      maxWidth="md"
    >
      <Card elevation={3}>
        <CardHeader
          avatar={<NoteIcon />}
          title="Notes"
          subheader="Manage your notes"
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
            <Grid container spacing={2} sx={{ marginBottom: "1rem" }}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Reference"
                  variant="outlined"
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Note"
                  multiline
                  variant="outlined"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  fullWidth
                />
              </Grid>
              <Grid
                item
                xs={12}
                sx={{ display: "flex", justifyContent: "flex-end" }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleAddNote}
                >
                  Add Note
                </Button>
              </Grid>
            </Grid>
            <Divider />
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Reference</TableCell>
                    <TableCell>Note</TableCell>
                    <TableCell align="center">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={3}>Loading...</TableCell>
                    </TableRow>
                  ) : error ? (
                    <TableRow>
                      <TableCell colSpan={3}>Error: {error.message}</TableCell>
                    </TableRow>
                  ) : (
                    notes.map((note) => (
                      <TableRow key={note.id}>
                        <TableCell>{note.reference}</TableCell>
                        <TableCell>{note.note}</TableCell>
                        <TableCell align="center">
                          <Box
                            sx={{ display: "flex", justifyContent: "center" }}
                          >
                            <EditNoteIcon
                              onClick={() => handleEditNote(note)}
                              sx={{ cursor: "pointer", marginRight: "1rem" }}
                            />
                            <DeleteIcon
                              onClick={() => handleDeleteNote(note.id)}
                              sx={{ cursor: "pointer" }}
                            />
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </CardContent>
      </Card>
      {isEditModalOpen && (
        <EditNoteModal
          open={isEditModalOpen}
          handleClose={() => setIsEditModalOpen(false)}
          data={noteBeingEdited}
          onEditSuccess={setEditSuccessMessage}
        />
      )}
      {addNoteMutation.isSuccess && (
        <CustomAlert severity="success" message="Note added successfully" />
      )}
      {addNoteMutation.isError && (
        <CustomAlert severity="error" message={addNoteMutation.error.message} />
      )}
      {deleteNoteMutation.isSuccess && (
        <CustomAlert severity="success" message="Note deleted successfully" />
      )}
      {deleteNoteMutation.isError && (
        <CustomAlert
          severity="error"
          message={deleteNoteMutation.error.message}
        />
      )}
      {editSuccessMessage && (
        <CustomAlert severity="success" message={editSuccessMessage} />
      )}
    </Container>
  );
}
