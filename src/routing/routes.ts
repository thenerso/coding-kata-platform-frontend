import React from "react";
import Login from "./../pages/auth/Login";

/**
 * Route Types
 */
export type IRouteType = {
  name: string;
  link: string;
  Component: React.FC;
  authed: boolean;
};

const routes: IRouteType[] = [
  /**
   * Auth
   */
  {
    name: "Login",
    link: "/login",
    Component: Login,
    authed: false,
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
