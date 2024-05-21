import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "aws-amplify/auth";

const userData_Api = import.meta.env.VITE_USERDATA_API;
const localPort = import.meta.env.VITE_LOCAL_PORT;

export function useUserQuery(userId, accessToken) {
  const { isLoading, error, data } = useQuery({
    queryKey: ["user", userId],
    queryFn: async () => {
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
    enabled: !!userId,
  });

  return { isLoading, error, data };
}
