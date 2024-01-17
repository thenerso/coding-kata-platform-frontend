import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";

import theme from "./theme";
import MainRouter from "./routing/MainRouter";
import { SnackbarProvider } from "notistack";
import AppProvider from "./context/AppContext";
import { HistoryProvider } from "./components/global/HistoryProvider";

/**
 * Entry point for the application
 *
 * @returns {JSX.Element}
 */
const App = (): JSX.Element => {
  return (
    <>
      <BrowserRouter>
        <HistoryProvider>
          <ThemeProvider theme={theme}>
            <SnackbarProvider maxSnack={6}>
              <AppProvider>
                <MainRouter />
              </AppProvider>
            </SnackbarProvider>
          </ThemeProvider>
        </HistoryProvider>
      </BrowserRouter>
    </>
  );
};

export default App;
