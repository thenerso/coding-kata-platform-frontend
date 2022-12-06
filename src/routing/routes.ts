import React from "react";
import Signup from "../pages/auth/Signup";
import Dashboard from "../pages/Dashboard";
import Profile from "../pages/Profile";
import ListUsers from "../pages/user/ListUsers";
import Login from "./../pages/auth/Login";

export enum UserRoles {
  UNAUTHED,
  USER,
  ADMIN,
}

/**
 * Route Types
 */
export type IRouteType = {
  name: string;
  link: string;
  Component: React.FC;
  authed: UserRoles;
  showInMenuFor: UserRoles;
};

const routes: IRouteType[] = [
  /**
   * Auth
   */
  {
    name: "Login",
    link: "/login",
    Component: Login,
    authed: UserRoles.UNAUTHED,
    showInMenuFor: UserRoles.UNAUTHED,
  },
  {
    name: "Signup",
    link: "/signup",
    Component: Signup,
    authed: UserRoles.UNAUTHED,
    showInMenuFor: UserRoles.UNAUTHED,
  },

  {
    name: "Dashboard",
    link: "/dashboard",
    Component: Dashboard,
    authed: UserRoles.USER,
    showInMenuFor: UserRoles.USER,
  },
  {
    name: "Profile",
    link: "/profile",
    Component: Profile,
    authed: UserRoles.USER,
    showInMenuFor: UserRoles.USER,
  },
  {
    name: "Users",
    link: "/users",
    Component: ListUsers,
    authed: UserRoles.ADMIN,
    showInMenuFor: UserRoles.ADMIN,
  },

  // /**
  //  * Modules
  //  */
  // {
  //   name: "Create Module",
  //   link: "/create/module",
  //   component: CreateModule,
  //   authed: true,
  // },
];

export default routes;
