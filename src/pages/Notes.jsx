import React, { useState } from "react";
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
} from "@mui/material";

export default function Notes() {
  const [reference, setReference] = useState("");
  const [note, setNote] = useState("");

  const handleAddNote = () => {
    // API call to add note will go here
  };

  return (
    <Container sx={{ paddingTop: "3%", paddingBottom: "3%" }}>
      <Card elevation={1}>
        <Grid
          container
          sx={{
            display: "flex",
            justifyContent: "space-evenly",
            alignItems: "center",
            paddingBlock: "1.3rem",
            paddingInline: "1.3rem",
          }}
        >
          <Grid item xs={12} md={3}>
            <CardHeader title="Notes" />
          </Grid>

          <Grid item xs={12} md={3}>
            <TextField
              label="Reference"
              variant="outlined"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={9} md={3}>
            <TextField
              label="Note"
              multiline
              variant="outlined"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={3} md={3}>
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
                  <TableCell>Reference</TableCell>
                  <TableCell>Note</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>{/* API call to get notes will go here */}</TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Container>
  );
}
