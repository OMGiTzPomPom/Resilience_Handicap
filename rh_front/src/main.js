import {createApp} from 'vue'
import App from './App.vue'
import router from './router'


import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";

import './assets/scss/main.scss';
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'


const ENV = import.meta.env;

axios.defaults.baseURL = ENV.VITE_BACK_ENDPOINTS_URL;
axios.defaults.withCredentials = true;

const app = createApp(App);

app.use(router);
app.use(ElementPlus);

app.mount('#app');
