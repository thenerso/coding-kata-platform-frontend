import axios, { AxiosError } from "axios";
import GlobalConfig from "../config/GlobalConfig";
import { IUser } from "../interfaces/user";

const userService = {
  getPage: async (token: string, page: number = 0, size: number = 10) => {
    const url = `${GlobalConfig.server_url}/admin/users?page=${page}&size=${size}`;
    const response = await axios.get(url, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    return response.data;
  },

  getPageContent: async (token: string, page: number = 0, size: number = 10) => {
    const data = await userService.getPage(token, page, size);
    return data.content || [];
  },

  getAll: async (token: string, callback: Function) => {
    let page = 0;
    const size = 10; // or whatever default size you prefer
    let allUsers: IUser[] = [];  // Assuming you have a type named User
    let isLastPage = false;

    while (!isLastPage) {
      try {
        const response = await userService.getPage(token, page, size);
        const users = response.content;

        if (response.last) {
          isLastPage = true;
        }

        allUsers = [...allUsers, ...users];

        // Callback to update the state or any other action you'd like to take
        callback && callback(allUsers);

        page++;
      } catch (error) {
        console.error('Error fetching page:', error);
        isLastPage = true;  // terminate loop if there's an error
      }
    }
    return allUsers;
  },

  getById: async (token: string, id: string): Promise<IUser> => {
    const res = await axios.get(`${GlobalConfig.server_url}/user/users/${id}`, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    return res.data;
  },
  deleteById: async (token: string, id: string) => {
    const res = await axios.delete(`${GlobalConfig.server_url}/admin/users/${id}`, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    return res.data;
  },
  update: async (token: string, body: IUser) => {
    try {
      const response = await axios.put(
        GlobalConfig.server_url + "/user/users/",
        body,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      if (response.status === 200) return response.data;

      throw AxiosError;
    } catch (err: any) {
      // If we get an axios error, we can assume the server down
      if (err?.code === "ERR_NETWORK") {
        throw new Error("Server error, please try again later");
      }
      if (typeof err.response.data === "string") throw new Error(err.response.data);

      throw new Error("Could not update User");
    }
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
  getCohortLeaderoard: async (token: string, cid: string): Promise<IUser[]> => {
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
    return res.data.content;
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
