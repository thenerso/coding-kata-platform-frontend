import axios from "axios";
import GlobalConfig from "../config/GlobalConfig";

const UserService = {
  getAll: () => {
    return axios.get(GlobalConfig.getApiOrigin + "/admin/users");
  },
};

export default UserService;
