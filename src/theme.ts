import { createTheme } from "@mui/material/styles";
// import { createTheme } from '@material-ui/core/styles';
const theme = createTheme({
  //custom theme will go herec
  // components: {
  //   MuiAppBar: {
  //     overrides: {
  //       color: '#225D61'
  //     }
  //   }
  // },
  palette: {
    mode: 'light',
    background: {
      default: '#225D61',
    },
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
