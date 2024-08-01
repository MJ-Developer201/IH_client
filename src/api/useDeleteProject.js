import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { getToken } from "../functions/getStorageToken";

// Assuming these are set in your environment or replace with actual values
const projectDeleteRoute = "project"; // Adjust if you have a specific environment variable for this
const localPort = import.meta.env.VITE_LOCAL_PORT;

export function useDeleteProjectMutation(projectId, organizationId) {
  const accessToken = getToken();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (projectId, organizationId) => {
      return axios.delete(
        `http://127.0.0.1:${localPort}/${projectDeleteRoute}/${organizationId}/${projectId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
    },
    onSuccess: () => {
      // Invalidate the projects query after the mutation
      queryClient.invalidateQueries(["projects", orgId]);

      console.log("Project deleted successfully");
    },
    onError: (error) => {
      console.log("Failed to delete project", error.message);
    },
  });

  return mutation;
}
