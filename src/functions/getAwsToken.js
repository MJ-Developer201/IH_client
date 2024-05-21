import { useState, useEffect } from "react";
import { fetchAuthSession } from "aws-amplify/auth";

function useSessionToken(signedIn) {
  const [tokens, setTokens] = useState({ accessToken: null, idToken: null });

  useEffect(() => {
    async function fetchTokens() {
      if (signedIn) {
        try {
          const { accessToken, idToken } =
            (await fetchAuthSession()).tokens ?? {};
          console.log("access token", accessToken);
          console.log("id token", idToken);
          setTokens({ accessToken, idToken });

          // Store accessToken in local storage
          localStorage.setItem("accessToken", accessToken);
        } catch (err) {
          console.error(err);
          setTokens({ accessToken: null, idToken: null });

          // Remove accessToken from local storage
          localStorage.removeItem("accessToken");
        }
      } else {
        setTokens({ accessToken: null, idToken: null });

        // Remove accessToken from local storage
        localStorage.removeItem("accessToken");
      }
    }

    fetchTokens();
  }, [signedIn]);

  return tokens;
}

export default useSessionToken;
