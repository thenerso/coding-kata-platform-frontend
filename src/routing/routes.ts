import React from "react";
import Signup from "../pages/auth/Signup";
import Cohort from "../pages/cohorts/Cohort";
import CreateCohort from "../pages/cohorts/CreateCohort";
import ListCohorts from "../pages/cohorts/ListCohorts";
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
  showInMenuFor?: UserRoles;
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

  /**
   * General
   */
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
  /**
   * User
   */
  {
    name: "Users",
    link: "/users",
    Component: ListUsers,
    authed: UserRoles.ADMIN,
    showInMenuFor: UserRoles.ADMIN,
  },

  /**
   * Cohort
   */
  {
    name: "Create Cohort",
    link: "/cohorts/new",
    Component: CreateCohort,
    authed: UserRoles.ADMIN,
  },
  {
    name: "Cohorts",
    link: "/cohorts",
    Component: ListCohorts,
    authed: UserRoles.ADMIN,
    showInMenuFor: UserRoles.ADMIN,
  },
  {
    name: "Cohort",
    link: "/cohorts/:id",
    Component: Cohort,
    authed: UserRoles.ADMIN,
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
