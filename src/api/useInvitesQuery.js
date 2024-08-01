import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { getToken } from "../functions/getStorageToken";

const localPort = import.meta.env.VITE_LOCAL_PORT;

export function useInvitesQuery(userId) {
  const accessToken = getToken();
  const { isLoading, error, data } = useQuery({
    queryKey: ["invites", userId], // Include userId in the query key
    queryFn: async () => {
      const response = await axios.get(
        `http://127.0.0.1:${localPort}/my-invites`, // Assuming the endpoint expects a query parameter for userId
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      return response.data;
    },
  });

  return { isLoading, error, data };
}
