import { Grid } from "@mui/material";
import React, { Suspense, useEffect, useState } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import EmptyState from "../components/global/EmptyState";
import Loading from "../components/global/Loading";
import Header from "../components/global/Header";
import Home from "../pages/Home";
import authService from "../services/authService";
import routes, { UserRoles } from "./routes";
import GlobalConfig from "../config/GlobalConfig";
import DashboardContainer from "../pages/DashboardContainer";

/**
 * Handles Routing for the application
 *
 * @returns {JSX.Element}
 */
const MainRouter = (): JSX.Element => {
  const [isAuthed, setIsAuthed] = useState(false);
  const [role, setRole] = useState<UserRoles>(UserRoles.UNAUTHED);
  // const { members, setNewMembers, setNewCohorts } = React.useContext(
  //   AppContext
  // ) as IAppContext;
  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate();
  const location = useLocation();

  console.log("Server: ", GlobalConfig.server_url);

  // Runs when route updates
  useEffect(() => {

    const determineUserRole = (role: string) => {
      switch (role) {
        case "ADMIN":
          setRole(UserRoles.ADMIN);
          break;
        case "USER":
          setRole(UserRoles.USER);
          break;
          case "CLIENT":
            setRole(UserRoles.CLIENT);
            break;
        default:
          setRole(UserRoles.UNAUTHED);
          break;
      }
      setLoading(false);
    };

    const user = authService.getUser();

    if (user && user?.roles) {
      setIsAuthed(() => new Date(user.exp as number) < new Date());
      determineUserRole(user.roles[0]);
    }
  }, [location]);

  const displayAuthState = (index: number, link: string, message: string) => {
    return (
      <Route
        key={`${index}-${link}`}
        path={link}
        element={
          <EmptyState
            displayIcon
            message={message}
            action={() => navigate("/")}
            actionLabel={"Login"}
          />
        }
      />
    );
  };

  //if(role == UserRoles.CLIENT && isAuthed) { navigate('/candidate')}s
  return (
    <>
      <Header
        isAuthed={isAuthed}
        role={role}
        setRole={setRole}
        setIsAuthed={setIsAuthed}
      />
      <Grid
        container
        component="main"
        style={{ marginTop: "40px", marginBottom: "40px", minHeight: "60vh" }}
        justifyContent="space-evenly"
      >
        <Grid item xs={11} alignSelf={loading ? "center" : "start"}>
          {loading ? (
            <Loading />
          ) 
          : (
            <Suspense fallback={<Loading />}>
              <Routes>
               <Route path="/" element={isAuthed ? <DashboardContainer role={role} /> : <Home />} />

                {routes.map(({ link, Component, authed }, i) => {
                  if (authed !== UserRoles.UNAUTHED && !isAuthed) {
                    return displayAuthState(
                      i,
                      link,
                      "You need to be logged in to view this page"
                    );
                  }
                  if (authed === UserRoles.USER && (role !== UserRoles.USER && role !== UserRoles.ADMIN)) {
                    return displayAuthState(
                      i,
                      link,
                      "You need user or admin access to view this page. Contact an adminstrator if you do not have an account."
                    );
                  }
                  if (authed === UserRoles.CLIENT && (role === UserRoles.UNAUTHED)) {
                    return displayAuthState(
                      i,
                      link,
                      "You need client or admin access to view this page"
                    );
                  }
                  if (authed === UserRoles.ADMIN && role !== UserRoles.ADMIN) {
                    return displayAuthState(
                      i,
                      link,
                      "You need admin access to view this page"
                    );
                  }

                  return <Route path={link} element={<Component />} key={i} />;
                })}
                <Route
                  path="*"
                  element={
                    <EmptyState
                      message={"The page you are looking for does not exist"}
                      action={() => navigate("/")}
                      actionLabel={"Home"}
                    />
                  }
                />
              </Routes>
            </Suspense>
          )}
        </Grid>
      </Grid>
    </>
  );
};

export default MainRouter;
