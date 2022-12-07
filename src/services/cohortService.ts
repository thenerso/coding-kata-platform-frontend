import axios from "axios";
import GlobalConfig from "../config/GlobalConfig";
import { ICohort } from "../pages/cohorts/ListCohorts";

const CohortServices = {
  getAll: async (token: string) => {
    const res = await axios.get(GlobalConfig.server_url + "/user/cohorts/", {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    return res.data;
  },
  getById: async (token: string, id: string) => {
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
    const res = await axios.post(
      GlobalConfig.server_url + "/admin/cohorts/",
      body,
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );
    return res.data;
  },
};

export default CohortServices;
