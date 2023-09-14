import axios, { AxiosError } from "axios";
import GlobalConfig from "../config/GlobalConfig";
import { ICohort } from "../interfaces/cohort";

const cohortService = {
  getPage: async (token: string, page: number = 0, size: number = 10) => {
    const url = `${GlobalConfig.server_url}/user/cohorts?page=${page}&size=${size}`;
    const response = await axios.get(url, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    return response.data;  // This will return the entire data object now
  },

  getPageContent: async (token: string, page: number = 0, size: number = 10) => {
    const response = await cohortService.getPage(token, page, size);
    return response.content || [];
  },

  getAll: async (token: string, callback: Function) => {
    let page = 0;
    const size = 10;  // Adjust this based on your preference
    let allCohorts: ICohort[] = [];
    let isLastPage = false;

    while (!isLastPage) {
      try {
        const response = await cohortService.getPage(token, page, size);
        const cohorts = response.content;

        if (response.last) {
          isLastPage = true;
        }

        allCohorts = [...allCohorts, ...cohorts];
        callback && callback(allCohorts);
        page++;
      } catch (error: any) {
        console.error('Error fetching page:', error);
        if (error && error.response) {
          const { status, data } = error.response;
          switch (status) {
            case 400:
              console.error('Bad Request:', data);
              break;
            case 401:
              console.error('Unauthorized. Token might be expired or invalid.');
              break;
            case 403:
              console.error('Forbidden. You do not have the necessary permissions.');
              break;
            case 404:
              console.error('Endpoint not found.');
              break;
            case 429:
              console.error('Too many requests. You are being rate limited.');
              break;
            case 500:
              console.error('Internal Server Error:', data);
              break;
            default:
              console.error('An unknown error occurred:', data);
              break;
          }
        } else {
          console.error('An unexpected error occurred:', error.message);
        }
        isLastPage = true;
      }
    }
    return allCohorts;
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
      throw new Error("Could not update Cohort");
    }
  },
  delete: async (token: string, id: string) => {
    try {
      const response = await axios.delete(
        `${GlobalConfig.server_url}/admin/cohorts/${id}`,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      if (response.status === 200) {
        return { message: "Cohort deleted" };
      }
      throw AxiosError;
    } catch (err: any) {
      // If we get an axios error, we can assume the server down
      if (err?.code === "ERR_NETWORK") {
        throw new Error("Server error, please try again later");
      }
      throw new Error("Could not delete Cohort");
    }
  },
};

export default cohortService;
