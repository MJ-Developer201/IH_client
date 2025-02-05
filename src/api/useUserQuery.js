import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "aws-amplify/auth";
import { getToken } from "../functions/getStorageToken";

const userData_Api = import.meta.env.VITE_USERDATA_API;
const localPort = import.meta.env.VITE_LOCAL_PORT;

export function useUserQuery(userId) {
  const accessToken = getToken();
  const { isLoading, error, data } = useQuery({
    queryKey: ["user", userId],
    queryFn: async () => {
      if (!userId) {
        return null;
      }
      const response = await axios.get(
        `http://127.0.0.1:${localPort}/${userData_Api}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      return response.data.user;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 30 * 60 * 1000, // 30 minutes
    refetchOnWindowFocus: false, // do not refetch on window focus
  });
  console.log(data);
  return { isLoading, error, data };
}
