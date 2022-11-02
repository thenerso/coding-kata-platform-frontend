import axios from 'axios';

const BASE = "auth/";
const PORT = 8080;

const AuthenticationService = {
    // {}
    signin:({username, password})=> {
        const userParams = this.toUrlEncoded({username, password});
        fetch(window.location.hostname + ":" + PORT + '/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            body: userParams
          })
    },

    logout: ()=> {

    },

    register: ()=> {

    },

    // converts standard json object to x-www-form-urlencoded format required by Spring Security
    toUrlEncoded: (details)=> {
        var formBody = [];
        for (var property in details) {
          var encodedKey = encodeURIComponent(property);
          var encodedValue = encodeURIComponent(details[property]);
          formBody.push(encodedKey + "=" + encodedValue);
        }
        formBody = formBody.join("&");
        return formBody;
    }
}

export default AuthenticationService;