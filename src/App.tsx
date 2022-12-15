import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";

import theme from "./theme";
import MainRouter from "./routing/MainRouter";
import { SnackbarProvider } from "notistack";

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
            <MainRouter />
          </SnackbarProvider>
        </ThemeProvider>
      </BrowserRouter>
    </>
  );
};

export default App;
