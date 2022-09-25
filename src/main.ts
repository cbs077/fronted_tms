import "./assets/main.css";
import "./assets/theme.scss";

import "./assets/theme.scss";
import ElementPlus from "element-plus";
import { createApp } from "vue";

import Breadcrumb from "~/components/atoms/breadcrumb.vue";
import BaseButton from "~/components/atoms/base-button.vue";
import ExcelButton from "~/components/molecules/excel-button.vue";
import OptionsSearchButton from "~/components/molecules/options-search-button.vue";

import App from "./App.vue";
import router from "./routes";
import store from "./store.vue";

const app = createApp(App)
app.component(BaseButton.name, BaseButton)
  .component(ExcelButton.name, ExcelButton)
  .component(OptionsSearchButton.name, OptionsSearchButton)
  .component(Breadcrumb.name, Breadcrumb)
  .use(router)
  .use(ElementPlus)
  .use(store)
  .mount("#app");

app.config.globalProperties.foo = "bar";