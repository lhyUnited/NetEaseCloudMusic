// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/nec.css'
import '@fortawesome/fontawesome-free/css/all.min.css'
import 'element-plus/theme-chalk/el-message.css'
import { ElMessage } from "element-plus";
import axios from 'axios'

axios.defaults.withCredentials = true
axios.defaults.baseURL = 'https://neteasecloudmusicapi-three-pi.vercel.app/'

const app = createApp(App)
app.use(router)
app.config.globalProperties.$message = ElMessage
app.config.globalProperties.axios = axios
app.config.productionTip = false
app.mount('#app')
