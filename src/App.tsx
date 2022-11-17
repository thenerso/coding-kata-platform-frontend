import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";

// import TopBar from "./components/TopBar";
// import PlaygroundContainer from "./containers/PlaygroundContainer";
import theme from "./theme";
import MainRouter from "./routing/MainRouter";
import { useEffect } from "react";

import AuthenticationService from "./services/authService";

/**
 * Entry point for the application
 *
 * @returns {React.FC}
 */
const App = () => {
  useEffect(() => {
    AuthenticationService.signin("richard", "fakepassword");
  }, []);

  return (
    <>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <MainRouter />
        </ThemeProvider>
        {/* <PlaygroundContainer /> */}
      </BrowserRouter>
    </>
  );
};

export default App;
