import { AccountCircle } from "@mui/icons-material";
import {
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Snackbar,
  Button,
} from "@mui/material";
import { Box } from "@mui/system";

import React from "react";

import { Link, useNavigate } from "react-router-dom";
import routes, { UserRoles } from "../../routing/routes";
import authService from "../../services/authService";

/**
 * Component Types
 */
interface IProps {
  isAuthed: boolean;
  setIsAuthed: (bool: boolean) => void;
  role: UserRoles;
  setRole: (role: UserRoles) => void;
}

/**
 * Header for the application
 */
const Header = ({ isAuthed, role, setIsAuthed, setRole }: IProps) => {
  /**
   * Initialize Google Analytics
   */
  // ReactGA.initialize(config.ga_id);

  const [message, setMessage] = React.useState("");
  const navigate = useNavigate();

  /**
   * Logout from the application
   */
  const submit = () => {
    if (isAuthed) {
      setIsAuthed(false);
      setRole(UserRoles.UNAUTHED);
      authService.logout();
      setMessage("Logged out successfully");
      handleClose();
      navigate("/");
    } else {
      setIsAuthed(false);
      setRole(UserRoles.UNAUTHED);
      setMessage("Error: You are not logged in");
    }
  };

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  let homeLink = "/";
  if (role === UserRoles.ADMIN) {
    homeLink = "/admin/dashboard";
  } else if (role === UserRoles.USER) {
    homeLink = "/dashboard";
  }

  return (
    <React.Fragment>
      <AppBar position="sticky">
        <Toolbar style={{ justifyContent: "space-between" }}>
          <Link to={homeLink}>
            <Box
              component="img"
              sx={{
                height: 40,
              }}
              alt="BNTA Logo"
              src="/img/bnta-logo.png"
            />
          </Link>

          <Box sx={{ display: { sm: "block" } }}>
            {routes
              .filter((route) => {
                if (role === UserRoles.ADMIN) {
                  return route.showInMenuFor === role && route.authed === role;
                }
                return route.showInMenuFor === role && route.authed === role;
              })
              .map((route) => (
                <Button
                  component={Link}
                  to={route.link}
                  key={route.link}
                  sx={{ color: "#fff" }}
                >
                  {route.name}
                </Button>
              ))}

            {isAuthed && (
              <React.Fragment>
                <IconButton
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenu}
                  color="inherit"
                >
                  <AccountCircle />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={open}
                  onClose={handleClose}
                >
                  <MenuItem
                    component={Link}
                    to="/profile"
                    onClick={handleClose}
                  >
                    Profile
                  </MenuItem>
                  <MenuItem onClick={submit}>Logout</MenuItem>
                </Menu>
              </React.Fragment>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      <Snackbar
        open={message !== ""}
        autoHideDuration={6000}
        onClose={() => setMessage("")}
        message={message}
      ></Snackbar>
    </React.Fragment>
  );
};

export default Header;
