import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const useOrgRedirect = (isLoading, data) => {
  const navigate = useNavigate();

  useEffect(() => {
    console.log("isLoading:", isLoading);
    console.log("data:", data);
    console.log("data.organization:", data && data.organization);
    if (
      !isLoading &&
      data &&
      (data.organization === null || data.organization === undefined)
    ) {
      navigate("/no-org");
    }
  }, [data, isLoading, navigate]);
};
