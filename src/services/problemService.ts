import axios from 'axios';
import GlobalConfig from '../config/GlobalConfig';

const ProblemService = {
    getAll: ()=> {
        return axios.get(GlobalConfig.getApiOrigin + '/problems');
    }
}

export default ProblemService;