import { createApp } from "vue";
import App from "./App.vue";
import setupPlugins from "@/plugins";
import "@/styles/index.scss";
import "uno.css";

const app = createApp(App);
app.use(setupPlugins);
app.mount("#app");
