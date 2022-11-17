import axios from 'axios';
import GlobalConfig from '../config/GlobalConfig';

const CompileService = {
    
    compile: (lang = "javascript", code = "console.log('hello world')") => {
        return axios.post(
            GlobalConfig.getApiOrigin + '/compile', {lang, code}
        );
    }
}

export default CompileService;