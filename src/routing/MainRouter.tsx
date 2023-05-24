import { Grid } from "@mui/material";
import React, { Suspense, useEffect, useState } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import EmptyState from "../components/global/EmptyState";
import Loading from "../components/global/Loading";
import Header from "../components/global/Header";
import Dashboard from "../pages/StudentDashboard";
import Home from "../pages/Home";
import authService from "../services/authService";
import routes, { UserRoles } from "./routes";
import { AppContext, IAppContext } from "../context/AppContext";
import userService from "../services/userService";
import cohortServices from "../services/cohortService";
import GlobalConfig from "../config/GlobalConfig";

/**
 * Handles Routing for the application
 *
 * @returns {JSX.Element}
 */
const MainRouter = (): JSX.Element => {
  const [isAuthed, setIsAuthed] = useState(false);
  const [role, setRole] = useState<UserRoles>(UserRoles.UNAUTHED);
  const { members, setNewMembers, setNewCohorts } = React.useContext(
    AppContext
  ) as IAppContext;
  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate();
  const location = useLocation();

  console.log("Server: ", GlobalConfig.server_url);

  // Runs when route updates
  useEffect(() => {
    const getUsersAndCohorts = () => {
      const token = authService.getAccessToken();
      if (token && members.length === 0) {
        userService.getAll(token).then((result) => {
          setNewMembers(result);
        });
        cohortServices.getAll(token).then((result) => {
          setNewCohorts(result);
        });
      }
    };

    const determineUserRole = (role: string) => {
      switch (role) {
        case "ADMIN":
          setRole(UserRoles.ADMIN);
          getUsersAndCohorts();
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
    // check if the user is authenticated

    /**
     * trying to use access token instead of user in session storage
     * so it's more secure, not implemented yet
     */
    // const token = authService.getAccessToken();
    // const user = authService.parseJwt(token ? token : null);

    const user = authService.getUser();

    if (user && user?.roles) {
      setIsAuthed(() => new Date(user.exp as number) < new Date());
      determineUserRole(user.roles[0]);
    }
  }, [location, members.length, setNewCohorts, setNewMembers]);

  const displayAuthState = (index: number, link: string, message: string) => {
    return (
      <Route
        key={`${index}-${link}`}
        path={link}
        element={
          <EmptyState
            displayIcon
            message={message}
            action={() => navigate("/login")}
            actionLabel={"Login"}
          />
        }
      />
    );
  };

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
          ) : (
            <Suspense fallback={<Loading />}>
              <Routes>
                <Route path="/" element={isAuthed ? <Dashboard /> : <Home />} />

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
                  if (authed === UserRoles.CLIENT && (role !== UserRoles.CLIENT && role !== UserRoles.ADMIN)) {
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
