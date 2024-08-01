import { Button, Grid, Typography } from "@mui/material";
import React from "react";
import PostAddOutlinedIcon from "@mui/icons-material/PostAddOutlined";

export default function AddProjectBtnComp() {
  return (
    <div>
      <Button
        sx={{ margin: 1, backgroundColor: "#17A2B8" }}
        variant="contained"
        onClick={() => console.log("How It Works")}
      >
        <Grid
          sx={{
            display: "flex",
            justifyContent: "",
            alignItems: "center",
          }}
        >
          <PostAddOutlinedIcon />
          <Typography variant=" ">Project</Typography>
        </Grid>
      </Button>
    </div>
  );
}
