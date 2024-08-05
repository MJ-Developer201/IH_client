import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { getToken } from "../functions/getStorageToken";

const ticketsPostRoute = import.meta.env.VITE_POST_TICKET_API; // Assuming a .env variable for the ticket post API
const localPort = import.meta.env.VITE_LOCAL_PORT;

export function useAddTicketMutation() {
  const accessToken = getToken();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (newTicket) => {
      console.log(`Sending ticket:`, newTicket); // Log the ticket being sent
      return axios
        .post(`http://127.0.0.1:${localPort}/${ticketsPostRoute}`, newTicket, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .catch((error) => {
          console.error(`Error sending ticket:`, error.message); // Log error response
          throw error; // Rethrow error to be handled by react-query
        });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["tickets"]);
    },
  });

  return mutation;
}
