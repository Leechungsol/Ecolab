import { axiosInstance } from "@/configs/query.config";

const base = "monthlybusiness";

/**
 * Provides APIs for monthly business-related functionality.
 */
export const apiMonthlyBusiness = {
  /**
   * Retrieves monthly business by mbusiKey.
   */
  getMonthlyBusinessByMbusiKey: async (mbusiKey) => {
    const { data } = await axiosInstance.get(`${base}/${mbusiKey}`);
    return data;
  },

  /**
   * Retrieves monthly business by busiKey and checkYm.
   */
  findMonthlyBusiness: async (params) => {
    const { data } = await axiosInstance.post(`${base}/find`, params);
    return data;
  },

  /**
   * Retrieves mbusiKey by busiKey and checkYm.
   */
  getMbusiKey: async (params) => {
    const { data } = await axiosInstance.post(`${base}/mbusikey`, params);
    return data;
  },
};