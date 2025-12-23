import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import '@/assets/css/reset.css'
import '@/assets/css/variables.css'
import '@/assets/css/common.css'
import '@/assets/css/icons.css'
import '@/assets/css/fonts.css'
import '@/assets/css/space.css'
import '@/assets/css/style.css'
const app = createApp(App)

app.use(router)

app.mount('#app')
