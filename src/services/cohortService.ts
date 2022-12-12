import axios, { AxiosError } from "axios";
import GlobalConfig from "../config/GlobalConfig";
import { ICohort } from "../interfaces/cohort";

const cohortServices = {
  getAll: async (token: string) => {
    const res = await axios.get(GlobalConfig.server_url + "/user/cohorts/", {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    return res.data;
  },
  getById: async (token: string, id: string): Promise<ICohort> => {
    const res = await axios.get(
      `${GlobalConfig.server_url}/user/cohorts/${id}`,
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );
    return res.data;
  },
  create: async (token: string, body: ICohort) => {
    try {
      const response = await axios.post(
        GlobalConfig.server_url + "/admin/cohorts/",
        body,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      if (response?.data.id) {
        return { id: response?.data.id, message: "Cohort created" };
      }
      throw AxiosError;
    } catch (err: any) {
      // If we get an axios error, we can assume the server down
      if (err?.code === "ERR_NETWORK") {
        throw new Error("Server error, please try again later");
      }
      throw new Error("Could not create Cohort");
    }
  },
  update: async (token: string, body: ICohort) => {
    try {
      const response = await axios.put(
        GlobalConfig.server_url + "/admin/cohorts/",
        body,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      if (response.status === 200) {
        return { message: "Cohort updated" };
      }
      throw AxiosError;
    } catch (err: any) {
      // If we get an axios error, we can assume the server down
      if (err?.code === "ERR_NETWORK") {
        throw new Error("Server error, please try again later");
      }
      throw new Error("Could not update Cohort");
    }
  },
};

export default cohortServices;
