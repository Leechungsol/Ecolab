import { axiosInstance } from "@/configs/query.config";

const base = "business";

/**
 * Provides APIs for business-related functionality,
 * including getting business data and external login.
 */
export const apiBusiness = {
  /**
   * Retrieves current business data.
   */
  getBusiness: async () => {
    const { data } = await axiosInstance.get(`${base}`);
    return data;
  },

  /**
   * Retrieves business by busiKey.
   */
  getBusinessByKey: async (busiKey) => {
    const { data } = await axiosInstance.get(`${base}/${busiKey}`);
    return data;
  },

  /**
   * Logs in a business with reportMatch4.
   */
  login: async (params) => {
    const { data } = await axiosInstance.post(`${base}/login`, params);
    return data;
  },
};