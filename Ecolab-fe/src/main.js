import App from "@/layouts/App.vue";
import { VueQueryPlugin } from "@tanstack/vue-query";
import "devextreme/dist/css/dx.common.css";
import { loadMessages, locale } from "devextreme/localization";
import themes from "devextreme/ui/themes";
import { createApp } from "vue";
import { queryClient } from "./configs/query.config";
import router from "./configs/router.config";
import dictionary from "./dictionary.json";
import ToastPlugin from "./plugins/toast.plugin";
import config from 'devextreme/core/config'; 
import { licenseKey } from './devextreme-license.ts'; 
 
config({ licenseKey });
themes.initialized(() => {
  const app = createApp(App);
  app.use(router);
  app.use(VueQueryPlugin, queryClient);
  app.use(ToastPlugin);
  app.mount("#app");

  loadMessages({ ko: dictionary });
  locale("ko");
});
