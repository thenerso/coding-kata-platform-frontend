import { getSuggestedQuery } from '@testing-library/react';
import axios from 'axios';

const PORT = 8080;

const AuthenticationService = {
    // {}
    signin: async ({username, password})=> {
        const userParams = this.toUrlEncoded({username, password});
        const response = await fetch(window.location.protocol + "//" + window.location.hostname + ":" + PORT + '/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            body: userParams
          });
        const json = await response.json();
          this.storeAccessToken(json.access_token);
          this.storeUser(this.parseJwt(json.accessToken));
        return response;
    },

    storeAccessToken: (accessToken)=> {
        localStorage.set('access_token', accessToken);
    },

    getAccessToken: () => {
        localStorage.getItem('access_token');
    },

    storeUser: (user) => {
        localStorage.setItem('user', JSON.stringify(user));
    },

    getUser: () => {
        return JSON.parse(localStorage.getItem('user'));
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
    },

    parseJwt: (token) => {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
    
        return JSON.parse(jsonPayload);
    }
}

export default AuthenticationService;