import { COOKIE } from "@/constants/cookie.constant";
import dayjs from "dayjs";
import Cookies from "js-cookie";

export default {
  setToken(accessToken) {
    if (accessToken) {
      Cookies.set(COOKIE.ACCESS_TOKEN, accessToken, {
        expires: dayjs().add(59, "days").endOf("day").toDate(),
      });
    }
  },
  setUser(data) {
    if (data) {
      Cookies.set(COOKIE.USER_INFO, JSON.stringify(data), {
        expires: dayjs().add(59, "days").endOf("day").toDate(),
      });
    }
  },
  getUser() {
    const userInfo = Cookies.get(COOKIE.USER_INFO);
    return userInfo ? JSON.parse(userInfo) : undefined;
  },
  isLoggedIn() {
    return Boolean(
      Cookies.get(COOKIE.ACCESS_TOKEN) && Cookies.get(COOKIE.USER_INFO),
    );
  },
  logOut() {
    Cookies.remove(COOKIE.ACCESS_TOKEN);
    Cookies.remove(COOKIE.USER_INFO);
  },
};
