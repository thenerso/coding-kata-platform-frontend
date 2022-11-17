import axios from "axios";
import GlobalConfig from "../config/GlobalConfig";

interface IEvaluate {
  userId: string;
  problemId: string;
  code: string;
  lang: string;
}

const EvalService = {
  evaluate: ({ userId, problemId, code, lang }: IEvaluate) => {
    return axios.post(GlobalConfig.getApiOrigin + "/eval", {
      userId,
      problemId,
      code,
      lang,
    });
  },
};

export default EvalService;
