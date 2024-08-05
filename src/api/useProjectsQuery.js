import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { getToken } from "../functions/getStorageToken";
import { useContext } from "react";
import { OrganizationContext } from "../App";

const getProjectsApi = import.meta.env.VITE_GET_PROJECTS_API;
const localPort = import.meta.env.VITE_LOCAL_PORT;

export function useProjectsQuery(orgId) {
  const { isLoading, error, data } = useQuery({
    queryKey: ["projects", orgId],
    queryFn: async () => {
      const accessToken = getToken();

      // Ensure the URL is constructed correctly
      const url = `http://127.0.0.1:${localPort}/${getProjectsApi}`;

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          organizationId: orgId, // Ensure this value is correctly populated
        },
      });
      // console.log(response.data.projects);
      return response.data.projects;
    },
    enabled: !!orgId, // Ensure the query is only enabled if orgData and orgData.id are truthy
  });

  return { isLoading, error, data };
}
