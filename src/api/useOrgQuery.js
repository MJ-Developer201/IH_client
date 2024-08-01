import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { getToken } from "../functions/getStorageToken";

const getOrg = import.meta.env.VITE_GET_ORG_API;
const localPort = import.meta.env.VITE_LOCAL_PORT;

export function useUserQuery() {
  const accessToken = getToken();
  const { isLoading, error, data } = useQuery({
    queryKey: ["organization"],
    queryFn: async () => {
      const response = await axios.get(
        `http://127.0.0.1:${localPort}/${getOrg}`,
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
