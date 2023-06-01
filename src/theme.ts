import { createTheme } from "@mui/material/styles";

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
    mode: "light",
    background: {
      default: "#225D61",
    },
    primary: {
      main: "#287f85",
    },
    secondary: {
      main: "#ff9b35",
    },
  },
  typography: {
    fontFamily: "Roboto, sans-serif",
    h1: {
      fontWeight: 500,
      fontSize: "3rem",
      marginBottom: "20px",
    },
    h2: {
      fontWeight: 400,
      fontSize: "1.6rem",
      marginBottom: "20px",
    },
  },

  components: {
    MuiTableHead: {
      styleOverrides: {
        root: {
          // backgroundColor: '#f7f7f7'
          borderBottom: "2px solid #bbb",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          marginbottom: '30px'
        }
      }
    }
  },
});

export default theme;
