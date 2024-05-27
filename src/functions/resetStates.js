import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useContext } from "react";
import { AuthContext, UserContext } from "../App";

export function resetStates() {
  const queryClient = useQueryClient();
  const [signedIn, setSignedIn] = useContext(AuthContext);
  const [userId, setUserId] = useContext(UserContext);

  const resetStatesAndQueries = () => {
    // Reset states

    // Remove all queries
    queryClient.removeQueries();
  };

  resetStatesAndQueries();
}
