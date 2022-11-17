//@ts-nocheck
//@TODO - convert this file to TS
import axios from "axios";
import GlobalConfig from "../config/GlobalConfig";

const AuthenticationService = {
  // {}
  signin: async (username: string, password: string) => {
    const userParams = this.toUrlEncoded({ username, password });
    //   const response = await fetch(window.location.protocol + "/" + window.location.hostname + ":" + PORT + '/login', {
    const response = await axios.post(
      GlobalConfig.getFrontendOrigin + "/login",
      userParams,
      {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      }
    );

    // const response = await fetch(GlobalConfig.getFrontendOrigin + '/login', {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    //     },
    //     body: userParams
    // });
    const json = await response.json();
    this.storeAccessToken(json.access_token);
    this.storeUser(this.parseJwt(json.accessToken));
    return response;
  },

  logout: () => {
    localStorage.setItem("access_token", "");
    localStorage.setItem("user", "");
  },

  register: () => {},

  storeAccessToken: (accessToken) => {
    localStorage.set("access_token", accessToken);
  },

  getAccessToken: () => {
    localStorage.getItem("access_token");
  },

  storeUser: (user) => {
    localStorage.setItem("user", JSON.stringify(user));
  },

  getUser: () => {
    return JSON.parse(localStorage.getItem("user"));
  },

  // converts standard json object to x-www-form-urlencoded format required by Spring Security
  toUrlEncoded: (details) => {
    var formBody = [];
    for (var property in details) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(details[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");
    return formBody;
  },

  parseJwt: (token) => {
    var base64Url = token.split(".")[1];
    var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    var jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );

    return JSON.parse(jsonPayload);
  },
};

export default AuthenticationService;
