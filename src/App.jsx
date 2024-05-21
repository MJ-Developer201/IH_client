import React, { useState, useContext, createContext, useEffect } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SignIn from "./pages/SignInPage";
import ProfilePage from "./pages/ProfilePage";
import { Grid } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ThemeProvider } from "@emotion/react";
import theme from "./functions/theme";

//aws imports
import { Amplify } from "aws-amplify";
import config from "./amplifyconfiguration.json";
Amplify.configure(config);
import Root from "./Root";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import useSessionToken from "./functions/getAwsToken";
import InsightPage from "./pages/InsightPage";
import ProjectsPage from "./pages/ProjectsPage";
import ActivityPage from "./pages/ActivityPage";
import { useUserQuery } from "./api/useUserQuery";
import { getToken } from "./functions/getStorageToken";
import { getCurrentUser } from "aws-amplify/auth";

//global Context

export const AuthContext = createContext();
export const UserContext = createContext();
export const PhotoUrlContext = createContext();

function App() {
  useEffect(() => {
    const fetchUser = async () => {
      const user = await getCurrentUser();
      setUserId(user.userId);
    };

    fetchUser();
  }, []);

  const [signedIn, setSignedIn] = useState(false);
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(true);
  const [userPhotoUrl, setUserPhotoUrl] = useState("");
  const accessToken = getToken();

  const { isLoading, error, data } = useUserQuery(userId, accessToken);

  return (
    <>
      <Router>
        <ThemeProvider theme={theme}>
          <UserContext.Provider value={[userId, setUserId]}>
            <AuthContext.Provider value={[signedIn, setSignedIn]}>
              <PhotoUrlContext.Provider value={[userPhotoUrl, setUserPhotoUrl]}>
                <Navbar />
                <Routes>
                  <Route path="/" element={<SignIn />} />
                  <Route path="/home" element={<HomePage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/insight" element={<InsightPage />} />
                  <Route path="/projects" element={<ProjectsPage />} />
                  <Route path="/activity" element={<ActivityPage />} />
                </Routes>
              </PhotoUrlContext.Provider>
            </AuthContext.Provider>
          </UserContext.Provider>
        </ThemeProvider>
      </Router>
    </>
  );
}

export default App;
