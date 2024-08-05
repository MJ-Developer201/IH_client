import React, { useState, useEffect } from "react";
import {
  Button,
  Grid,
  TextField,
  Dialog,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useEditNote } from "../api/useEditNote";
import { CustomAlert } from "./CustomNotification";

export default function EditNoteModal({
  data,
  handleClose,
  open,
  onEditSuccess,
}) {
  const [reference, setReference] = useState("");
  const [note, setNote] = useState("");
  const editNoteMutation = useEditNote();

  // Update state when data prop changes
  useEffect(() => {
    if (data) {
      setReference(data.reference);
      setNote(data.note);
    }
  }, [data]);

  const handleSave = () => {
    editNoteMutation.mutate(
      {
        noteId: data.id,
        updateFields: {
          reference,
          note,
        },
      },
      {
        onSuccess: () => {
          console.log("success");

          onEditSuccess("Note edited successfully");
          handleClose();
        },
        onError: () => {
          console.log("error");
          setAlert({ message: "Error saving data", severity: "error" });
        },
      }
    );
  };

  return (
    <Dialog sx={{ borderRadius: "30px" }} open={open} onClose={handleClose}>
      <DialogContent sx={{ padding: "5rem" }} dividers>
        <Grid container spacing={6}>
          <Grid item xs={12} sm={12}>
            <TextField
              label="Reference"
              value={reference}
              fullWidth
              onChange={(e) => setReference(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <TextField
              label="Note"
              value={note}
              fullWidth
              onChange={(e) => setNote(e.target.value)}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSave}>
          Save Changes
        </Button>
      </DialogActions>
      <CustomAlert message={alert.message} severity={alert.severity} />
    </Dialog>
  );
}
