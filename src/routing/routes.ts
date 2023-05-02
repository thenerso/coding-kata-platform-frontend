import React from "react";
import AdminDashboard from "../pages/AdminDashboard";
import StudentDashboard from "../pages/StudentDashboard";
import ForgetPassword from "../pages/auth/ForgetPassword";
import ResetPassword from "../pages/auth/ResetPassword";
import Cohort from "../pages/cohorts/Cohort";
import CreateCohort from "../pages/cohorts/CreateCohort";
import ListCohorts from "../pages/cohorts/ListCohorts";
import UpdateCohort from "../pages/cohorts/UpdateCohort";

import Home from "../pages/Home";
import CreateProblemSet from "../pages/problem-sets/CreateProblemSet";
import ListProblemSets from "../pages/problem-sets/ListProblemSets";
import ProblemSet from "../pages/problem-sets/ProblemSet";
import ProblemSetUser from "../pages/user-level/problem-sets/ProblemSet";
import UpdateProblemSet from "../pages/problem-sets/UpdateProblemSet";
import Attempt from "../pages/problems/Attempt";
import CreateProblem from "../pages/problems/CreateProblem";
import ListProblems from "../pages/problems/ListProblems";
import Problem from "../pages/problems/Problem";
import UpdateProblem from "../pages/problems/UpdateProblem";
import Profile from "../pages/Profile";
import ListSolutions from "../pages/solutions/ListAllSolutions";
import Solution from "../pages/solutions/Solution";
import CreateUser from "../pages/users/CreateUser";
import ListUsers from "../pages/users/ListUsers";
import UserInfo from "../pages/users/UserInfo";
import { OverridableComponent } from "@mui/material/OverridableComponent";
import { SvgIconTypeMap } from "@mui/material";
import {
  Dashboard,
  Edit,
  Groups,
  List,
  Person,
  Rule,
} from "@mui/icons-material";
import ListProblemSetsForUsers from "../pages/user-level/problem-sets/ListProblemSetsForUsers";

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
  icon?: OverridableComponent<SvgIconTypeMap<{}, "svg">>;
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
    link: "/reset-password/:id/:secret",
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
    Component: StudentDashboard,
    authed: UserRoles.USER,
    showInMenuFor: UserRoles.USER,
    icon: Dashboard,
  },
  {
    name: "Dashboard",
    link: "/admin/dashboard",
    Component: AdminDashboard,
    authed: UserRoles.ADMIN,
    showInMenuFor: UserRoles.ADMIN,
    icon: Dashboard,
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
    icon: Person,
  },
  {
    name: "User",
    link: "/users/:id",
    Component: UserInfo,
    authed: UserRoles.ADMIN,
  },
  {
    name: "Create User",
    link: "/users/new",
    Component: CreateUser,
    authed: UserRoles.ADMIN,
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
    icon: Groups,
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

  /**
   * Problem Set
   */
  {
    name: "Create Problem Set",
    link: "/problem-sets/new",
    Component: CreateProblemSet,
    authed: UserRoles.ADMIN,
  },
  {
    name: "Problem Sets",
    link: "/problem-sets",
    Component: ListProblemSets,
    authed: UserRoles.ADMIN,
    showInMenuFor: UserRoles.ADMIN,
    icon: List,
  },
  {
    name: "Problem Sets",
    link: "/users/problem-sets",
    Component: ListProblemSetsForUsers,
    authed: UserRoles.USER,
    showInMenuFor: UserRoles.USER,
    icon: List,
  },
  {
    name: "Problem Set",
    link: "/problem-sets/:id",
    Component: ProblemSet,
    authed: UserRoles.ADMIN,
  },
  {
    name: "Problem Set",
    link: "/users/problem-sets/:id",
    Component: ProblemSetUser,
    authed: UserRoles.USER,
  },
  {
    name: "Update Problem Set",
    link: "/problem-sets/edit/:id",
    Component: UpdateProblemSet,
    authed: UserRoles.ADMIN,
  },

  /**
   * Problem
   */
  {
    name: "Create Problem",
    link: "/problems/new",
    Component: CreateProblem,
    authed: UserRoles.ADMIN,
  },
  {
    name: "Problems",
    link: "/problems",
    Component: ListProblems,
    authed: UserRoles.ADMIN,
    showInMenuFor: UserRoles.ADMIN,
    icon: Edit,
  },
  {
    name: "Problem",
    link: "/problems/:id",
    Component: Problem,
    authed: UserRoles.USER,
  },
  {
    name: "Update Problem",
    link: "/problems/edit/:id",
    Component: UpdateProblem,
    authed: UserRoles.ADMIN,
  },
  /**
   * Attempt
   */
  {
    name: "Attempt",
    link: "/problems/attempt/:id",
    Component: Attempt,
    authed: UserRoles.USER,
  },
  /**
   * Solution
   */
  {
    name: "Solutions",
    link: "/solutions",
    Component: ListSolutions,
    authed: UserRoles.ADMIN,
    showInMenuFor: UserRoles.ADMIN,
    icon: Rule,
  },
  {
    name: "Solution",
    link: "/solutions/:id",
    Component: Solution,
    authed: UserRoles.USER,
  },
];

export default routes;
