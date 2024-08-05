// useAddProjectMutation.js
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { getToken } from "../functions/getStorageToken";

const projectsPostRoute = import.meta.env.VITE_PROJECT_POST_API; // Assuming you have a .env variable for the project post API
const localPort = import.meta.env.VITE_LOCAL_PORT;

export function useAddProjectMutation() {
  const accessToken = getToken();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (newProject) => {
      return axios.post(
        `http://127.0.0.1:${localPort}/${projectsPostRoute}`,
        newProject,
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
      queryClient.invalidateQueries(["projects"]);

      console.log("Project added successfully");
    },
    onError: (error) => {
      console.log("Failed to add project", error.message);
    },
  });

  return mutation;
}
