import axios, { AxiosError } from "axios";
import GlobalConfig from "../config/GlobalConfig";
import { IProblemSet } from "../interfaces/problemSet";

const problemSetServices = {
  getAll: async (token: string) => {
    const res = await axios.get(
      GlobalConfig.server_url + "/user/problems/sets/",
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );
    return res.data;
  },
  getById: async (token: string, id: string): Promise<IProblemSet> => {
    try {
      const response = await axios.get(
        `${GlobalConfig.server_url}/user/problems/sets/${id}`,
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
      throw new Error("Could not find Problem Set");
    }
  },
  create: async (token: string, body: IProblemSet) => {
    try {
      const response = await axios.post(
        GlobalConfig.server_url + "/admin/problems/sets/",
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
      throw new Error("Could not create Problem Set");
    }
  },
  update: async (token: string, body: IProblemSet) => {
    try {
      const response = await axios.put(
        GlobalConfig.server_url + "/admin/problems/sets/",
        body,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      if (response.status === 200) {
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
      throw new Error("Could not update Problem Set");
    }
  },
  delete: async (token: string, id: string) => {
    try {
      const response = await axios.delete(
        `${GlobalConfig.server_url}/admin/problems/sets/${id}`,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      if (response.status === 200) {
        return { message: "Problem Set deleted" };
      }
      throw AxiosError;
    } catch (err: any) {
      // If we get an axios error, we can assume the server down
      if (err?.code === "ERR_NETWORK") {
        throw new Error("Server error, please try again later");
      }
      throw new Error("Could not delete Problem Set");
    }
  },
};

export default problemSetServices;
