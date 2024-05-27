import React, { useState, useContext, createContext, useEffect } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SignInPage from "./pages/SignInPage";
import ProfilePage from "./pages/ProfilePage";
import { Grid } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ThemeProvider } from "@emotion/react";
import theme from "./functions/theme";
import { fetchAuthSession, signIn } from "aws-amplify/auth";

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
import NotesPage from "./pages/NotesPage";

//global Context

export const AuthContext = createContext();
export const UserContext = createContext();
export const PhotoUrlContext = createContext();
export const ProfileContext = createContext();

// Amplify.configure({
//   ...config,
//   Auth: {
//     ...config.Auth,
//     storage: window.localStorage, // sets the storage system to local storage
//   },
// });

function App() {
  const [signedIn, setSignedIn] = useState(false);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userPhotoUrl, setUserPhotoUrl] = useState("");
  const [profileData, setProfileData] = useState({});
  const [setData] = useState({});
  const accessToken = getToken();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const session = await fetchAuthSession();
        if (session) {
          const { idToken } = session.tokens;
          const user = idToken.payload;
          console.log(user.sub);
          setUserId(user.sub);
          setSignedIn(true);
        }
      } catch (error) {
        // console.error("Failed to fetch user:", error.message);
      }
    };

    fetchUser();
  }, []);

  // get the current user
  // useEffect(() => {
  //   const fetchUser = async () => {
  //     try {
  //       if (userId) {
  //         const user = await getCurrentUser();
  //         console.log(user.userId);
  //         setUserId(user.userId);
  //       }
  //     } catch (error) {
  //       console.error("Failed to fetch user:", error);
  //     }
  //   };

  //   fetchUser();
  // }, []);

  const { isLoading, error, data } = useUserQuery(userId);

  return (
    <>
      <Router>
        <ThemeProvider theme={theme}>
          <UserContext.Provider value={[userId, setUserId]}>
            <AuthContext.Provider value={[signedIn, setSignedIn]}>
              <ProfileContext.Provider value={data}>
                <PhotoUrlContext.Provider
                  value={[userPhotoUrl, setUserPhotoUrl]}
                >
                  {data && <Navbar />}
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/notes" element={<NotesPage />} />
                    <Route path="/signin" element={<SignInPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/insight" element={<InsightPage />} />
                    <Route path="/projects" element={<ProjectsPage />} />
                    <Route path="/activity" element={<ActivityPage />} />
                  </Routes>
                </PhotoUrlContext.Provider>
              </ProfileContext.Provider>
            </AuthContext.Provider>
          </UserContext.Provider>
        </ThemeProvider>
      </Router>
    </>
  );
}

export default App;
