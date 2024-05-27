import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getToken } from "../functions/getStorageToken";
import { useContext } from "react";
import { UserContext } from "../App";

const userMutationApi = import.meta.env.VITE_USER_UPDATE_API;
const localPort = import.meta.env.VITE_LOCAL_PORT;

export function useUserMutation() {
  const accessToken = getToken();
  const queryClient = useQueryClient();
  const [userId, setUserId] = useContext(UserContext);

  const mutation = useMutation({
    mutationFn: (updateFields) => {
      return axios.put(
        `http://127.0.0.1:${localPort}/${userMutationApi}`,
        updateFields,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
    },
    onSuccess: () => {
      // Invalidate the user query after the mutation
      queryClient.invalidateQueries(["user", userId]);

      alert("User updated successfully");
      console.log("User updated successfully");
    },
    onError: (error) => {
      console.log(
        "Failed to update",
        error.response ? error.response.data : error.message
      );
    },
  });

  return mutation;
}
