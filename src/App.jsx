import React, { useState, useContext, createContext, useEffect } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SignInPage from "./pages/SignInPage";
import ProfilePage from "./pages/ProfilePage";
import { Container } from "@mui/material";
import { ThemeProvider } from "@emotion/react";
import theme from "./functions/theme";
import { fetchAuthSession, signIn } from "aws-amplify/auth";
import { useOrganizationQuery } from "./api/useOrganizationQuery";

//aws imports
import { Amplify } from "aws-amplify";
import config from "./amplifyconfiguration.json";
Amplify.configure(config);
import Sidebar from "./components/Sidebar";
import InsightPage from "./pages/InsightPage";
import ProjectsPage from "./pages/ProjectsPage";
import ActivityPage from "./pages/ActivityPage";
import { useUserQuery } from "./api/useUserQuery";
import { getToken } from "./functions/getStorageToken";
import NoOrgPage from "./pages/NoOrgPage";
import NotesPage from "./pages/NotesPage";
import AdminPage from "./pages/AdminPage";
import AddProjectModal from "./components/AddProjectModal";
import ProjectPage from "./pages/ProjectPage";
import AddTicketModal from "./components/AddTicketModal";
import { useTicketsQuery } from "./api/useTicketsQuery";
import ViewTicketPage from "./pages/ViewTicketPage";
import SignUpPage from "./pages/SignUpPage";
import ConfirmationPage from "./pages/ConfirmationPage";
import TeamPage from "./pages/TeamPage";

//global Context

export const AuthContext = createContext();
export const UserContext = createContext();
export const PhotoUrlContext = createContext();
export const ProfileContext = createContext();
export const SidebarContext = createContext();
export const OrganizationContext = createContext();
export const ProjectsContext = createContext();

function App() {
  const [signedIn, setSignedIn] = useState(false);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userPhotoUrl, setUserPhotoUrl] = useState("");
  const [profileData, setProfileData] = useState({});
  const accessToken = getToken();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [orgId, setOrgId] = useState(null);
  const [orgData, setOrgData] = useState({});
  const [projectId, setProjectId] = useState(null);
  const [isDataFetch, setIsDataFetch] = useState(false);

  useEffect(() => {
    // if (!signedIn) return;
    const fetchUser = async () => {
      try {
        const session = await fetchAuthSession();
        if (session) {
          const { idToken } = session.tokens;
          const user = idToken.payload;
          console.log("Fetched user ID:", user.sub);
          // console.log(user.sub);
          setUserId(user.sub);
          setSignedIn(true);
        }
      } catch (error) {
        return;
      }
    };

    fetchUser();
  }, []);

  // start of user query
  const { isLoading, error, data } = useUserQuery(userId);

  useEffect(() => {
    // if (!signedIn)
    if (data) {
      setOrgId(data.organizationId);
      setProfileData(data);
      setIsDataFetch(true);
    }
  }, [data]);
  console.log;

  // start of organization query
  const {
    isLoading: orgLoading,
    error: orgError,
    data: organization,
  } = useOrganizationQuery(orgId);

  useEffect(() => {
    if (organization) {
      setOrgData(organization);
    }
  }, [organization]);

  // start of projects query

  //
  // start of tickets query
  const {
    isLoading: tktsLoading,
    error: tktsError,
    data: tktsData,
  } = useTicketsQuery(orgId, profileData.projectId);

  // if (tktsData) {
  if (orgError) {
    console.log(orgError.message);
    // return <div>Error: {orgError.message}</div>;
  }

  return (
    <>
      <Router>
        <ThemeProvider theme={theme}>
          <UserContext.Provider value={[userId, setUserId]}>
            <AuthContext.Provider value={[signedIn, setSignedIn]}>
              <OrganizationContext.Provider value={[orgData, setOrgData]}>
                <ProfileContext.Provider value={data}>
                  <ProjectsContext.Provider value={[projectId, setProjectId]}>
                    <PhotoUrlContext.Provider
                      value={[userPhotoUrl, setUserPhotoUrl]}
                    >
                      <SidebarContext.Provider
                        value={[isSidebarOpen, setSidebarOpen]}
                      >
                        {/* {data && <Navbar />} */}
                        {data && <Sidebar />}
                        <Container
                          className={`container ${
                            isSidebarOpen ? "sidebarOpen" : "sidebarClosed"
                          }`}
                        >
                          <Routes>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/admin" element={<AdminPage />} />
                            <Route path="/notes" element={<NotesPage />} />
                            <Route path="/no-org" element={<NoOrgPage />} />
                            <Route path="/signin" element={<SignInPage />} />
                            <Route path="/signup" element={<SignUpPage />} />

                            <Route path="/team" element={<TeamPage />} />

                            <Route
                              path="/confirmation"
                              element={<ConfirmationPage />}
                            />

                            <Route path="/profile" element={<ProfilePage />} />
                            <Route
                              path="/viewticket/:projectId/:issue/:ticketId"
                              element={<ViewTicketPage />}
                            />
                            <Route path="/invites" element={<InsightPage />} />
                            <Route
                              path="/projects"
                              element={<ProjectsPage />}
                            />
                            <Route
                              path="/add-ticket"
                              element={<AddTicketModal />}
                            />

                            <Route
                              path="/activity"
                              element={<ActivityPage />}
                            />
                            <Route
                              path="project/:projectId"
                              element={<ProjectPage />}
                            />

                            <Route
                              path="/add-project"
                              element={<AddProjectModal />}
                            />
                          </Routes>
                        </Container>
                      </SidebarContext.Provider>
                    </PhotoUrlContext.Provider>
                  </ProjectsContext.Provider>
                </ProfileContext.Provider>
              </OrganizationContext.Provider>
            </AuthContext.Provider>
          </UserContext.Provider>
        </ThemeProvider>
      </Router>
    </>
  );
}

export default App;
