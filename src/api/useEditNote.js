// useEditNoteMutation.js
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { getToken } from "../functions/getStorageToken";

const notesEditRoute = import.meta.env.VITE_NOTE_EDIT_API;
const localPort = import.meta.env.VITE_LOCAL_PORT;

export function useEditNote() {
  const accessToken = getToken();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ noteId, updateFields }) => {
      return axios.put(
        `http://127.0.0.1:${localPort}/${notesEditRoute}/${noteId}`,
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
      // Invalidate the notes query after the mutation
      queryClient.invalidateQueries("notes");

      console.log("Note updated successfully");
    },
    onError: (error) => {
      console.log("Failed to update note", error.message);
    },
  });

  return mutation;
}
