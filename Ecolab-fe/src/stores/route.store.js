import navigations from "@/constants/navigation.constant";
import { reactive } from "vue";

export const routeStore = reactive({
  isLoading: false,
  ranks: null,
  items: [navigations[0]],
});
