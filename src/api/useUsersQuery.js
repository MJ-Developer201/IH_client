import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { getToken } from "../functions/getStorageToken";

const usersData_Api = import.meta.env.VITE_GET_USERS_API;
const localPort = import.meta.env.VITE_LOCAL_PORT;

export function useUsersQuery() {
  const accessToken = getToken();
  const { isLoading, error, data } = useQuery({
    queryKey: ["all-user"],
    queryFn: async () => {
      const response = await axios.get(
        `http://127.0.0.1:${localPort}/${usersData_Api}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      return response.data;
    },
    refetchOnWindowFocus: false,
  });

  return { isLoading, error, data };
}
