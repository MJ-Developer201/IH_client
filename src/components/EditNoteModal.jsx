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

export default function EditNoteModal({ data, handleClose, open }) {
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
    editNoteMutation.mutate({
      noteId: data.id,
      updateFields: {
        reference,
        note,
      },
    });
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogContent>
        <Grid container spacing={6}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Reference"
              value={reference}
              fullWidth
              onChange={(e) => setReference(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Note"
              value={note}
              fullWidth
              multiline
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
    </Dialog>
  );
}
