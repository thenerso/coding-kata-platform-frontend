import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";

import theme from "./theme";
import MainRouter from "./routing/MainRouter";
import { SnackbarProvider } from "notistack";
import AppProvider from "./context/AppContext";

/**
 * Entry point for the application
 *
 * @returns {JSX.Element}
 */
const App = (): JSX.Element => {
  return (
    <>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <SnackbarProvider maxSnack={6}>
            <AppProvider>
              <MainRouter />
            </AppProvider>
          </SnackbarProvider>
        </ThemeProvider>
      </BrowserRouter>
    </>
  );
};

export default App;
