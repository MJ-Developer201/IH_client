import React from "react";
import { useUserQuery } from "../api/useOrgQuery";

import { CircularProgress, Typography, Card, CardContent } from "@mui/material";

export default function OrgAdminComp() {
  const { isLoading, error, data } = useUserQuery();

  if (isLoading) return <CircularProgress />;
  if (error)
    return (
      <Typography
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          paddingTop: "3rem ",
          flexDirection: "column",
        }}
      >
        An error has occurred: {error.message}
      </Typography>
    );
  {
  }
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        paddingTop: "3rem ",
        flexDirection: "column",
      }}
    >
      {data?.organizations?.map((org) => (
        <Card key={org.id} style={{ marginBottom: "1rem", width: "50%" }}>
          <CardContent>
            <Typography variant="h5">{org.name}</Typography>
            <Typography variant="body2">{org.description}</Typography>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
