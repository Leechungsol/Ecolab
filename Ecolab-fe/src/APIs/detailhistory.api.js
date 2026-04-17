import { axiosInstance } from "@/configs/query.config";

const base = "detailhistory";

/**
 * Provides APIs for detail history-related functionality.
 */
export const apiDetailHistory = {
  /**
   * Retrieves detail history list by mbusiKey.
   */
  getList: async (mbusiKey) => {
    const { data } = await axiosInstance.get(`${base}/${mbusiKey}`);
    return data;
  },

  /**
   * Retrieves detail history detail by mbusiKey and detailKey.
   */
  getDetail: async (mbusiKey, detailKey) => {
    const { data } = await axiosInstance.get(`${base}/${mbusiKey}/${detailKey}`);
    return data;
  },

  /**
   * Saves action contents and action image.
   * params must be FormData
   */
  save(data) {
    return axiosInstance.post("/detailhistory/save", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};