import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { getToken } from "../functions/getStorageToken";

const notesDeleteRoute = import.meta.env.VITE_NOTE_DELETE_API;
const localPort = import.meta.env.VITE_LOCAL_PORT;

export function useDeleteNoteMutation() {
  const accessToken = getToken();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id) => {
      return axios.delete(
        `http://127.0.0.1:${localPort}/${notesDeleteRoute}/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
    },
    onSuccess: () => {
      // Invalidate the notes query after the mutation
      queryClient.invalidateQueries(["notes"]);

      console.log("Note deleted successfully");
    },
    onError: (error) => {
      console.log("Failed to delete note", error.message);
    },
  });

  return mutation;
}
