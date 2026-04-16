import { COOKIE } from "@/constants/cookie.constant";
import axios, { HttpStatusCode } from "axios";
import notify from "devextreme/ui/notify";
import Cookies from "js-cookie";

const queryClient = {
  queryClientConfig: {
    defaultOptions: {
      queries: {
        retry: false,
        refetchOnWindowFocus: false,
      },
    },
  },
};

const axiosInstance = axios.create({
  // Sets the base URL for the Axios instance using the `VUE_APP_BASE_API_URL` environment variable.
  baseURL: `${process.env.VUE_APP_BASE_API_URL}`,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = Cookies.get(COOKIE.ACCESS_TOKEN);

    // Adds the access token to the `Authorization` header of each request if the token is available in the cookies.
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handles HTTP error responses and displays a toast notification with the error message.
    let message = "";
    switch (error?.response?.status) {
      case HttpStatusCode.InternalServerError:
        message = "오류가 발생했습니다. 다시 시도해주세요.";
        break;
      case HttpStatusCode.Unauthorized:
        message = "로그인이 만료되었습니다. 다시 로그인해주세요.";
        break;
      case HttpStatusCode.Forbidden:
        message = "접근 권한이 없습니다.";
        break;
      case HttpStatusCode.BadRequest:
        message = "잘못된 요청입니다.";
        break;
      default:
        break;
    }
    if (message && !error?.config?.skipToast) {
      notify({ message, width: 350 }, "error", 3000);
    }
    return Promise.reject(error);
  },
);

export { axiosInstance, queryClient };
