import axios, { AxiosError } from "axios";
import GlobalConfig from "../config/GlobalConfig";
import { IEvaluate } from "../interfaces/eval";

const EvalService = {
  evaluate: async (
    { userId, problemId, code, lang }: IEvaluate,
    token: string
  ) => {
    try {
      const response = await axios.post(
        GlobalConfig.server_url + "/user/eval/" + problemId,
        {
          userId,
          code,
          lang,
        },
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
      throw new Error("Could not evaluate solution");
    }
  },
  test: async (
    { userId, problemId, code, lang }: IEvaluate,
    token: string
  ) => {
    try {
      const response = await axios.post(
        GlobalConfig.server_url + "/user/eval/test/" + problemId,
        {
          userId,
          code,
          lang,
        },
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
      throw new Error("Could not evaluate solution");
    }
  }
};

export default EvalService;
