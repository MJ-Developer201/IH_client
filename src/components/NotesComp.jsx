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
  setRef,
  Checkbox,
} from "@mui/material";
import { UserContext } from "../App";
import axios from "axios";
import { useAddNoteMutation } from "../api/useAddNoteMutation";
import { useNotesQuery } from "../api/useNotesQuery";
import DeleteIcon from "@mui/icons-material/Delete";
import EditNoteIcon from "@mui/icons-material/EditNote";
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
  // const notesPostRoute = import.meta.env.VITE_NOTE_PUT_API;
  const deleteNoteMutation = useDeleteNoteMutation();

  // add notes function
  const handleAddNote = () => {
    addNoteMutation.mutate({ reference, note });
    setReference("");
    setNote("");
  };

  // delete notes function
  const handleDeleteNote = (id) => {
    deleteNoteMutation.mutate(id);
  };

  // edit notes function
  const handleEditNote = (note) => {
    setNoteBeingEdited(note);
    setIsEditModalOpen(true);
  };
  // deconstructing the notes query
  const { isLoading, error, data: notes } = useNotesQuery();

  // display success message

  // display error message

  return (
    <Container sx={{ paddingTop: "3%", paddingBottom: "3%" }}>
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
      <Card elevation={1}>
        <Grid
          container
          sx={{
            justifyContent: "center",
            alignItems: "center",
            paddingBlock: "1.3rem",
            paddingInline: "1.3rem",
          }}
        >
          {/* <Grid item xs={12} md={3}>
            <CardHeader title="Notes" />
          </Grid> */}

          <Grid sx={{ paddingInline: "2rem " }} item xs={12} md={3}>
            <TextField
              label="Reference"
              variant="outlined"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid sx={{ paddingInline: "1rem" }} item xs={9} md={3}>
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
            sx={{ display: "flex", justifyContent: "right" }}
            item
            xs={3}
            md={3}
          >
            <Button variant="contained" color="primary" onClick={handleAddNote}>
              Add Note
            </Button>
          </Grid>
        </Grid>
        <Divider />
        <CardContent>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="center"></TableCell>
                  <TableCell>Reference</TableCell>
                  <TableCell>Note</TableCell>
                  <TableCell align="center">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={2}>Loading...</TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={2}>Error: {error.message}</TableCell>
                  </TableRow>
                ) : (
                  notes.map((note) => (
                    <TableRow key={note.id}>
                      <TableCell>
                        <Checkbox />
                      </TableCell>
                      <TableCell>{note.reference}</TableCell>
                      <TableCell>{note.note}</TableCell>
                      <TableCell>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-evenly ",
                          }}
                        >
                          <EditNoteIcon onClick={() => handleEditNote(note)} />
                          <DeleteIcon
                            onClick={() => handleDeleteNote(note.id)}
                          />
                        </div>
                      </TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
      {isEditModalOpen && (
        <EditNoteModal
          open={isEditModalOpen}
          handleClose={() => setIsEditModalOpen(false)}
          data={noteBeingEdited}
        />
      )}
    </Container>
  );
}
