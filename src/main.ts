import "./assets/main.css";
import "./assets/theme.scss";

import ElementPlus from "element-plus";
import { createApp } from "vue";

import App from "./App.vue";
import router from "./routes";

createApp(App).use(router).use(ElementPlus).mount("#app");
