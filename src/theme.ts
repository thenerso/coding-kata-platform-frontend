import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  //custom theme will go herec
  components: {
    MuiAppBar: {
      styleOverrides: {
        
      }
    }
  },
  palette: {
    mode: 'light',
    primary: {
      main: '#ff8f00',
    },
    secondary: {
      main: '#225D61',
    },
  },
  typography: {
    fontFamily: "Roboto, sans-serif",
    h1: {
      fontWeight: 600,
      fontSize: "3rem",
      marginBottom: "20px",
    },
    h2: {
      fontWeight: 600,
      fontSize: "1.6rem",
      marginBottom: "20px",
    }
  },
});

export default theme;
