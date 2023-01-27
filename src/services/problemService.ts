import axios, { AxiosError } from "axios";
import GlobalConfig from "../config/GlobalConfig";
import { IProblem, IProblemSet } from "../interfaces/problemSet";

const problemServices = {
  getAll: async (token: string) => {
    const res = await axios.get(GlobalConfig.server_url + "/user/problems/", {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    return res.data;
  },
  getById: async (token: string, id: string): Promise<IProblem> => {
    const res = await axios.get(
      `${GlobalConfig.server_url}/user/problems/${id}`,
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );
    return res.data;
  },
  create: async (token: string, body: IProblem) => {
    try {
      const response = await axios.post(
        GlobalConfig.server_url + "/admin/problems/",
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
      throw new Error("Could not create Problem");
    }
  },
  update: async (token: string, body: IProblemSet) => {
    try {
      const response = await axios.put(
        GlobalConfig.server_url + "/admin/problems/",
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
      throw new Error("Could not update Problem");
    }
  },
  delete: async (token: string, id: string) => {
    try {
      const response = await axios.delete(
        `${GlobalConfig.server_url}/admin/problems/${id}`,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      if (response.status === 200) {
        return { message: "Problem deleted" };
      }
      throw AxiosError;
    } catch (err: any) {
      // If we get an axios error, we can assume the server down
      if (err?.code === "ERR_NETWORK") {
        throw new Error("Server error, please try again later");
      }
      throw new Error("Could not delete Problem");
    }
  },
};

export default problemServices;
