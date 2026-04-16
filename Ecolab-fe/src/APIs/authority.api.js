import { axiosInstance } from "@/configs/query.config";

const base = "authority";

/**
 * Provides an API for retrieving authority web mapping data.
 */
export const apiAuthority = {
  /**
   * Retrieves the authority web mapping data.
   */
  getAuthorityWebMapping: async () => {
    const { data } = await axiosInstance.get(`${base}/web-mapping`);
    return data;
  },
};
