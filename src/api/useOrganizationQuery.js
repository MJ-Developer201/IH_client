import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { getToken } from "../functions/getStorageToken";

const getSingleOrgApi = import.meta.env.VITE_GET_SINGLE_ORG_API;
const localPort = import.meta.env.VITE_LOCAL_PORT;

export function useOrganizationQuery(orgId) {
  const { isLoading, error, data } = useQuery({
    queryKey: ["organization", orgId],
    queryFn: async () => {
      const accessToken = getToken();

      const response = await axios.get(
        `http://127.0.0.1:${localPort}/${getSingleOrgApi}/${orgId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      return response.data.organization;
    },
    enabled: !!orgId,
  });

  return { isLoading, error, data };
}
