// useAddNoteMutation.js
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { getToken } from "../functions/getStorageToken";

const notesPostRoute = import.meta.env.VITE_NOTE_PUT_API;
const localPort = import.meta.env.VITE_LOCAL_PORT;

export function useAddNoteMutation() {
  const accessToken = getToken();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (newNote) => {
      return axios.post(
        `http://127.0.0.1:${localPort}/${notesPostRoute}`,
        newNote,
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

      console.log("Note added successfully");
    },
    onError: (error) => {
      console.log("Failed to add note", error.message);
    },
  });

  return mutation;
}
