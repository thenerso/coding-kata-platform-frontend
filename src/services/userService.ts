import axios from "axios";
import GlobalConfig from "../config/GlobalConfig";

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
  getCohortLeaderoard: async (token: string, cid: string) => {
    const res = await axios.get(`${GlobalConfig.server_url}/user/users/leaderboard/${cid}`, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    return res.data;
  }
};

export default userService;
