import React from "react";
import Box from "@mui/material/Box";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import { IRouteType } from "../../routing/routes";
import { Link } from "react-router-dom";
import { IconButton, Typography } from "@mui/material";
import { AccountCircle, ChevronRight, InsertLink } from "@mui/icons-material";
import styled from "@emotion/styled";
import authService from "../../services/authService";

const StyledLink = styled(Link)`
  text-decoration: none;
`;

const StyledAvartarBox = styled("div")`
  margin: 40px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: rgb(0, 0, 0, 0.87);
`;

const StyledTypography = styled(Typography)`
  margin: 10px 0;
  text-decoration: none;
`;

/**
 * Component Types
 */
interface IProps {
  routes: IRouteType[];
}

/**
 * Drawer for the application
 */
const Drawer = ({ routes }: IProps) => {
  const [open, setOpen] = React.useState(false);

  const user = authService.getUser();

  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event &&
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }
      setOpen(open);
    };

  const list = () => (
    <Box
      sx={{ width: 245 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <IconButton onClick={toggleDrawer(false)}>
        <ChevronRight />
      </IconButton>
      <Divider />
      <StyledLink to={"/profile"}>
        <StyledAvartarBox>
          <AccountCircle fontSize="large" />
          <StyledTypography variant="body1">
            Howdy, {user?.sub} 👋🏻
          </StyledTypography>
        </StyledAvartarBox>
      </StyledLink>
      <Divider />
      <List>
        {routes.map((route) => {
          return (
            <ListItem key={route.link} disablePadding>
              <ListItemButton component={Link} to={route.link}>
                <ListItemIcon>
                  {route.icon ? <route.icon /> : <InsertLink />}
                </ListItemIcon>
                <ListItemText primary={route.name} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
      <Divider />
    </Box>
  );

  return (
    <React.Fragment>
      <IconButton onClick={toggleDrawer(true)}>
        <MenuIcon sx={{ color: "#fff" }} />
      </IconButton>
      <SwipeableDrawer
        anchor={"right"}
        open={open}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
      >
        {list()}
      </SwipeableDrawer>
    </React.Fragment>
  );
};

export default Drawer;
