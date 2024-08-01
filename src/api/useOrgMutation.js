import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getToken } from "../functions/getStorageToken";

const orgMutationApi = import.meta.env.VITE_POST_ORG_API;
const localPort = import.meta.env.VITE_LOCAL_PORT;

export function useOrgMutation() {
  const accessToken = getToken();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (newOrgFields) => {
      return axios.post(
        `http://127.0.0.1:${localPort}/${orgMutationApi}`,
        newOrgFields,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
    },
    onSuccess: () => {
      // Invalidate the organization query after the mutation
      queryClient.invalidateQueries("organization");

      console.log("Organization created successfully");
    },
    onError: (error) => {
      console.log(
        "Failed to create",
        error.response ? error.response.data : error.message
      );
    },
  });

  return mutation;
}
