import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { getToken } from "../functions/getStorageToken";

const notesGetApi = import.meta.env.VITE_NOTE_GET_API;
const localPort = import.meta.env.VITE_LOCAL_PORT;

console.log(notesGetApi);

export function useNotesQuery() {
  const { isLoading, error, data } = useQuery({
    queryKey: ["notes"],
    queryFn: async () => {
      const accessToken = getToken();

      const response = await axios.get(
        `http://127.0.0.1:${localPort}/${notesGetApi}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      return response.data.notes;
    },
    // enabled: !!userId,
  });

  return { isLoading, error, data };
}
