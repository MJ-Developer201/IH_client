import * as React from "react";
import Alert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import Snackbar from "@mui/material/Snackbar";
import CheckIcon from "@mui/icons-material/Check";
import ReportGmailerrorredIcon from "@mui/icons-material/ReportGmailerrorred";
import CloseIcon from "@mui/icons-material/Close";

export function CustomAlert({ message, severity }) {
  const [open, setOpen] = React.useState(true);

  const iconMapping = {
    success: <CheckIcon fontSize="inherit" />,
    error: <ReportGmailerrorredIcon fontSize="inherit" />,
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  return (
    <Snackbar open={open} autoHideDuration={4000} onClose={handleClose}>
      <Alert
        action={
          <IconButton
            aria-label="close"
            color="inherit"
            size="small"
            onClick={handleClose}
          >
            <CloseIcon fontSize="inherit" />
          </IconButton>
        }
        severity={severity}
        variant="filled"
        iconMapping={iconMapping}
      >
        {message}
      </Alert>
    </Snackbar>
  );
}
