import React from "react";
import ForgetPassword from "../pages/auth/ForgetPassword";
import ResetPassword from "../pages/auth/ResetPassword";
import Cohort from "../pages/cohorts/Cohort";
import CreateCohort from "../pages/cohorts/CreateCohort";
import ListCohorts from "../pages/cohorts/ListCohorts";
import UpdateCohort from "../pages/cohorts/UpdateCohort";
import Dashboard from "../pages/Dashboard";
import Home from "../pages/Home";
import Profile from "../pages/Profile";
import ListUsers from "../pages/user/ListUsers";

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
    link: "/",
    Component: Home,
    authed: UserRoles.UNAUTHED,
    showInMenuFor: UserRoles.UNAUTHED,
  },
  {
    name: "Reset Password",
    link: "/reset-password/:id",
    Component: ResetPassword,
    authed: UserRoles.UNAUTHED,
  },
  {
    name: "Forget Password",
    link: "/forget-password",
    Component: ForgetPassword,
    authed: UserRoles.UNAUTHED,
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
  {
    name: "Update Cohort",
    link: "/cohorts/edit/:id",
    Component: UpdateCohort,
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
