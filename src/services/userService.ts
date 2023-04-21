import axios, { AxiosError } from "axios";
import GlobalConfig from "../config/GlobalConfig";
import { IUser } from "../interfaces/user";

const userService = {
  getAll: async (token: string) => {
    const res = await axios.get(GlobalConfig.server_url + "/admin/users/", {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    return res.data;
  },
  getById: async (token: string, id: string) => {
    const res = await axios.get(`${GlobalConfig.server_url}/user/users/${id}`, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    return res.data;
  },
  getUserProgress: async (token: string, id: string) => {
    const res = await axios.get(
      `${GlobalConfig.server_url}/user/users/${id}/progress`,
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );
    return res.data;
  },
  getCohortLeaderoard: async (token: string, cid: string) => {
    const res = await axios.get(
      `${GlobalConfig.server_url}/user/users/leaderboard/${cid}`,
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );
    return res.data;
  },
  getGlobalLeaderboard: async (token: string) => {
    const res = await axios.get(
      `${GlobalConfig.server_url}/admin/users/leaderboard`,
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );
    return res.data;
  },
  create: async (token: string, body: IUser) => {
    try {
      const response = await axios.post(
        GlobalConfig.server_url + "/admin/users/",
        body,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      if (response?.data.id) {
        return response.data;
      }
      throw AxiosError;
    } catch (err: any) {
      // If we get an axios error, we can assume the server down
      if (err?.code === "ERR_NETWORK") {
        throw new Error("Server error, please try again later");
      }
      if (typeof err.response.data === "string") {
        throw new Error(err.response.data);
      }
      throw new Error("Could not create User");
    }
  },
};

export default userService;
