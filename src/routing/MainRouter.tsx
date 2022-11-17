import { Grid } from "@mui/material";
import React, { Suspense } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import EmptyState from "../components/EmptyState";
import Home from "../pages/Home";
import routes from "./routes";

/**
 * Handles Routing for the application
 *
 * @returns {React.FC}
 */
const MainRouter = () => {
  const [isAuthed, setIsAuthed] = React.useState(false);
  //   const jwt = auth.isAuthenticated();
  //   setAuth(jwt ? true : false);
  const navigate = useNavigate();
  return (
    <React.Fragment>
      {/* <Header isAuthed={isAuthed} setIsAuthed={setIsAuthed} history={history} /> */}
      <Grid container style={{ marginTop: "20px", marginBottom: "20px" }}>
        <Grid item xs={11}>
          <Suspense fallback={<p>Loading</p>}>
            <Routes>
              <Route path="/" element={<Home />} />

              {routes.map(({ link, Component, authed }, i) => {
                if (authed && !isAuthed)
                  return (
                    <Route
                      key={`${i}-${link}`}
                      element={
                        <EmptyState
                          message="You need to be logged in to view this page"
                          action={() => navigate("/login")}
                          actionLabel={"Login"}
                        />
                      }
                    />
                  );

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
