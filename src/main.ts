import { createApp } from 'vue'
import '@/style.css'
import App from '@/App.vue'
import 'mdb-vue-ui-kit/css/mdb.min.css'
import router from '@/router'
import { createPinia } from 'pinia'
import 'animate.css'

const app = createApp(App)
app.use(router)
app.use(createPinia())
app.mount('#app')