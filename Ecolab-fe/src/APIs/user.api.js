import { axiosInstance } from "@/configs/query.config";

const base = "user";

/**
 * Provides APIs for user-related functionality, including getting user data and logging in.
 */
export const apiUser = {
  /**
   * Retrieves the current user's data.
   */
  getUser: async () => {
    const { data } = await axiosInstance.get(`${base}`);
    return data;
  },

  /**
   * Logs in a user with the provided parameters.
   */
  login: async (params) => {
    const { data } = await axiosInstance.post(`${base}/login`, params);
    return data;
  },
};
