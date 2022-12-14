import { Grid } from "@mui/material";
import React, { Suspense, useEffect } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import EmptyState from "../components/EmptyState";
import Loading from "../components/global/Loading";
import Header from "../components/Header";
import Dashboard from "../pages/Dashboard";
import Home from "../pages/Home";
import authService from "../services/authService";
import routes, { UserRoles } from "./routes";

/**
 * Handles Routing for the application
 *
 * @returns {React.FC}
 */
const MainRouter = () => {
  const [isAuthed, setIsAuthed] = React.useState(false);
  const [role, setRole] = React.useState<UserRoles>(UserRoles.UNAUTHED);

  const navigate = useNavigate();
  const location = useLocation();

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
        default:
          setRole(UserRoles.UNAUTHED);
          break;
      }
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
  }, [location]);

  const displayAuthState = (index: number, link: string, message: string) => {
    return (
      <Route
        key={`${index}-${link}`}
        path={link}
        element={
          <EmptyState
            message={message}
            action={() => navigate("/login")}
            actionLabel={"Login"}
          />
        }
      />
    );
  };

  return (
    <React.Fragment>
      <Header
        isAuthed={isAuthed}
        role={role}
        setRole={setRole}
        setIsAuthed={setIsAuthed}
      />
      <Grid
        container
        component="main"
        style={{ marginTop: "20px", marginBottom: "20px" }}
        justifyContent="space-evenly"
      >
        <Grid item xs={11}>
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
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default MainRouter;
