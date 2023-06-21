import axios, { AxiosError } from "axios";
import GlobalConfig from "../config/GlobalConfig";
import { IUserProfile } from "../interfaces/user";

const userProfileService = {
    getAll: async (token: string) => {
        const res = await axios.get(GlobalConfig.server_url + "/user/profiles/", {
            headers: {
                Authorization: "Bearer " + token,
            },
        });
        return res.data;
    },
    getById: async (token: string, id: string): Promise<IUserProfile> => {
        const res = await axios.get(`${GlobalConfig.server_url}/user/profiles/${id}`, {
            headers: {
                Authorization: "Bearer " + token,
            },
        });
        return res.data;
    },
    create: async (token: string, body: IUserProfile) => {
        try {
            const response = await axios.post(
                GlobalConfig.server_url + "/user/profiles/",
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
    uploadHeadshot: async (token: string, id: string, file: File) => {
        let formData = new FormData();
        formData.append('file', file);

        const res = await axios.post(
            `${GlobalConfig.server_url}/user/profiles/${id}/headshot`,
            formData,
            {
                headers: {
                    Authorization: "Bearer " + token,
                },
            },
        );
        return res.data;
    },

    getHeadshot: async (token: string, id: string) => {
        const res = await axios.get(
            `${GlobalConfig.server_url}/user/profiles/${id}/headshot`,
            {
                headers: {
                    Authorization: "Bearer " + token,
                },
                responseType: 'blob'
            },
        );
        return res.data;
    },

    uploadResume: async (token: string, id: string, file: File) => {
        let formData = new FormData();
        formData.append('file', file);

        const res = await axios.post(
            `${GlobalConfig.server_url}/user/profiles/${id}/cv`,
            formData,
            {
                headers: {
                    Authorization: "Bearer " + token,
                },
            },
        );
        return res.data;
    },

    getResume: async (token: string, id: string) => {
        const res = await axios.get(
            `${GlobalConfig.server_url}/user/profiles/${id}/cv`,
            {
                headers: {
                    Authorization: "Bearer " + token,
                },
                responseType: 'blob'
            },
        );
        return res.data;
    },
};


export default userProfileService;
