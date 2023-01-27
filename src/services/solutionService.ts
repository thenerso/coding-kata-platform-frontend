import axios, { AxiosError } from "axios";
import GlobalConfig from "../config/GlobalConfig";
import { ISolution } from "../interfaces/solutions";

const solutionService = {
  getAll: async (token: string) => {
    const res = await axios.get(GlobalConfig.server_url + "/admin/solutions", {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    return res.data;
  },
  getById: async (token: string, id: string): Promise<ISolution> => {
    const res = await axios.get(
      `${GlobalConfig.server_url}/user/problems/solutions/${id}`,
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );
    return res.data;
  },
  getAllForUser: async (token: string, id: string): Promise<ISolution> => {
    const res = await axios.get(
      `${GlobalConfig.server_url}/admin/solutions/user/${id}`,
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );
    return res.data;
  },
  getAllForProblem: async (token: string, id: string): Promise<ISolution> => {
    const res = await axios.get(
      `${GlobalConfig.server_url}/admin/solutions/problem/${id}`,
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );
    return res.data;
  },
  delete: async (token: string, id: string) => {
    try {
      const response = await axios.delete(
        `${GlobalConfig.server_url}/admin/solutions/${id}`,
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
      throw new Error("Could not delete Solution");
    }
  },
};

export default solutionService;
