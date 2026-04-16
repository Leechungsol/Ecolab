import { THEME } from "@/constants/theme.constant";
import { reactive } from "vue";

export const themeStore = reactive({
  current: THEME.SOFTBLUE,
});
