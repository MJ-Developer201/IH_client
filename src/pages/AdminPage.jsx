import React from "react";
import OrgAdminComp from "../components/OrgAdminComp";
import AdminCreateOrgFrm from "../components/AdminCreateOrgFrm";
import { Box } from "@mui/material";
import InviteComp from "../components/InviteComp";
import AcceptInvitesComp from "../components/AcceptInvitesComp";

export default function AdminPage() {
  return (
    <div>
      <Box sx={{ display: "flex", flexDirection: "column", gap: "5rem" }}>
        <AdminCreateOrgFrm />
        {/* <InviteComp /> */}
        {/* <OrgAdminComp /> */}
      </Box>
    </div>
  );
}
