import axios from 'axios'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import PrimeVue from 'primevue/config'
import moment from "moment"

import 'primeflex/primeflex.css'
import 'primevue/resources/themes/saga-blue/theme.css'
import 'primevue/resources/primevue.min.css'
import 'primeicons/primeicons.css'

import ArticleService from './services/ArticleService'

moment.locale('fr')

const app = createApp(App)
axios.defaults.baseURL = 'http://localhost:8080/'
const articleService = new ArticleService(axios)

app.config.globalProperties.$http = axios

app.provide("articleService", articleService)
    .provide('moment', moment)

app.use(store)
    .use(router)
    .use(PrimeVue)
    .mount('#app')

