import React, { useContext } from "react";
import HomePage from "./pages/HomePage";
import SignIn from "./pages/SignInPage";

import { AuthContext } from "./App";

export default function Root() {
  const [signedIn, isSignedIn] = useContext(AuthContext);
  return (
    <>
      <HomePage />
    </>
  );
}
