import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { getToken } from "../functions/getStorageToken";
// import { useContext } from "react";
// import { OrganizationContext } from "../App";

const getTicketsApi = import.meta.env.VITE_GET_TICKETS_API;
const localPort = import.meta.env.VITE_LOCAL_PORT;

export function useTicketsQuery(orgId, projectId) {
  // const [orgData, setOrgData] = useContext(OrganizationContext);

  const { isLoading, error, data } = useQuery({
    queryKey: ["tickets", projectId],
    queryFn: async () => {
      const accessToken = getToken();

      // Ensure the URL is constructed correctly
      const url = `http://127.0.0.1:${localPort}/${getTicketsApi}`;

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          organizationId: orgId, // Ensure this value is correctly
          projectId: projectId,
        },
      });

      return response.data;
    },
    enabled: !!orgId && !!projectId, // Ensure the query is only enabled if orgData and orgData.id are truthy
  });

  return { isLoading, error, data };
}
