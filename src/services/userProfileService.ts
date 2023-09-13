import axios, { AxiosError } from "axios";
import GlobalConfig from "../config/GlobalConfig";
import { IUserProfile } from "../interfaces/user";

const userProfileService = {
    getPage: async (token: string, page: number = 0, size: number = 10) => {
        const url = `${GlobalConfig.server_url}/user/profiles?page=${page}&size=${size}`;
        const response = await axios.get(url, {
          headers: {
            Authorization: "Bearer " + token,
          },
        });
        return response.data;
      },
    
      getPageContent: async (token: string, page: number = 0, size: number = 10) => {
        const data = await userProfileService.getPage(token, page, size);
        return data.content || [];
      },
    
      getAll: async (token: string, callback: Function) => {
        let page = 0;
        const size = 10; // or whatever default size you prefer
        let allProfiles: IUserProfile[] = [];
        let isLastPage = false;
    
        while (!isLastPage) {
          try {
            const response = await userProfileService.getPage(token, page, size);
            const profiles = response.content;
    
            if (response.last) {
              isLastPage = true;
            }
    
            allProfiles = [...allProfiles, ...profiles];
    
            // Callback to update the state or any other action you'd like to take
            callback && callback(allProfiles);
    
            page++;
          } catch (error) {
            console.error('Error fetching page:', error);
            isLastPage = true;  // terminate loop if there's an error
          }
        }
        return allProfiles;
      },
    

    getById: async (token: string, id: string): Promise<IUserProfile> => {
        const res = await axios.get(`${GlobalConfig.server_url}/user/profiles/${id}`, {
            headers: {
                Authorization: "Bearer " + token,
            },
        });
        return res.data;
    },
    create: async (token: string, body: IUserProfile, id: string) => {
        try {
            const response = await axios.post(
                GlobalConfig.server_url + `/user/profiles/${id}`,
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
            throw new Error("Could not create UserProfile");
        }
    },
    update: async (token: string, id: string, body: IUserProfile) => {
        try {
            const response = await axios.put(
                `${GlobalConfig.server_url}/user/profiles/${id}`,
                body,
                {
                    headers: {
                        Authorization: "Bearer " + token,
                    },
                }
            );

            if (response.status === 200) return response.data;

            throw AxiosError;
        } catch (err: any) {
            // If we get an axios error, we can assume the server down
            if (err?.code === "ERR_NETWORK") {
                throw new Error("Server error, please try again later");
            }
            if (typeof err.response.data === "string") throw new Error(err.response.data);

            throw new Error("Could not update UserProfile");
        }
    },
    delete: async (token: string, id: string) => {
        const res = await axios.delete(`${GlobalConfig.server_url}/user/profiles/${id}`, {
            headers: {
                Authorization: "Bearer " + token,
            },
        });
        return res.data;
    },
    getResume: async (token: string, id: string): Promise<File> => {
        const res = await axios.get(`${GlobalConfig.server_url}/user/profiles/${id}/resume`, {
            headers: {
                Authorization: "Bearer " + token,
            },
            responseType: 'blob'
        });
        return new File([res.data], 'resume.pdf', { type: 'application/pdf' });
    },
    getHeadshot: async (token: string, id: string): Promise<File> => {
        const res = await axios.get(`${GlobalConfig.server_url}/user/profiles/${id}/headshot`, {
            headers: {
                Authorization: "Bearer " + token,
            },
            responseType: 'blob'
        });
        return new File([res.data], 'headshot.jpg', { type: 'image/jpeg' });
    },
    uploadHeadshot: async (token: string, id: string, file: File): Promise<any> => {
        let formData = new FormData();
        formData.append('file', file);

        try {
            const res = await axios.post(`${GlobalConfig.server_url}/user/profiles/${id}/headshot`, formData, {
                headers: {
                    'Authorization': "Bearer " + token,
                    'Content-Type': 'multipart/form-data'
                },
            });
            return res.data;
        } catch (error) {
            console.error(error);
            return error;
        }
    },
    uploadResume: async (token: string, id: string, file: File): Promise<any> => {
        let formData = new FormData();
        formData.append('file', file);

        try {
            const res = await axios.post(`${GlobalConfig.server_url}/user/profiles/${id}/resume`, formData, {
                headers: {
                    'Authorization': "Bearer " + token,
                    'Content-Type': 'multipart/form-data'
                },
            });
            return res.data;
        } catch (error) {
            console.error(error);
            return error;
        }
    },
};


export default userProfileService;
