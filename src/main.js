import { createApp } from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import { loadFonts } from "./plugins/webfontloader";
import router from "./router.js";
import BaseLoading from "./UI/BaseLoading.vue";

loadFonts();

createApp(App)
  .component("Loading", BaseLoading)
  .use(vuetify)
  .use(router)
  .mount("#app");
