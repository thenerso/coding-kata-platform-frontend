import axios, { AxiosError } from "axios";
import GlobalConfig from "../config/GlobalConfig";
import { ISolution, ISolutionDTO } from "../interfaces/solutions";

const solutionService = {
  getPage: async (token: string, page: number = 0, size: number = 10) => {
    const url = `${GlobalConfig.server_url}/admin/solutions?page=${page}&size=${size}`;
    const response = await axios.get(url, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    return response.data;  // This will return the entire data object now
  },

  getPageContent: async (token: string, page: number, size: number) => {
    const response = await solutionService.getPage(token, page, size);
    return response.content || [];
  },

  getAll: async (token: string, callback: Function) => {
    let page = 0;
    const size = 10;  // Adjust this based on your preference
    let allSolutions: ISolution[] = [];
    let isLastPage = false;

    while (!isLastPage) {
      try {
        const response = await solutionService.getPage(token, page, size);
        const solutions = response.content;

        if (response.last) {
          isLastPage = true;
        }

        allSolutions = [...allSolutions, ...solutions];
        callback && callback(allSolutions);
        page++;
      } catch (error: any) {
        console.error('Error fetching page:', error);

        // If axios error, we can give a more detailed error response
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
          // If not an axios error, just print the error message
          console.error('An unexpected error occurred:', error.message);
        }

        isLastPage = true;  // terminate loop if there's an error
      }
    }
    return allSolutions;
  },

  getById: async (token: string, id: string): Promise<ISolutionDTO> => {
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
  getAllForUser: async (token: string, id: string): Promise<ISolutionDTO> => {
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
  getAllForProblem: async (token: string, id: string): Promise<ISolutionDTO> => {
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
