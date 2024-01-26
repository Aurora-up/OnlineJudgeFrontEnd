import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import TDesign from 'tdesign-vue-next';
import 'tdesign-vue-next/es/style/index.css';
import mitt from 'mitt'

// 通用字体
import 'vfonts/Lato.css'
// 等宽字体
import 'vfonts/FiraCode.css'

const Mit = mitt()

declare module "vue" {
  export interface ComponentCustomProperties {
    $Bus: typeof Mit
  }
}


const app = createApp(App)

app.config.globalProperties.$Bus = Mit

app.use(TDesign)
app.use(createPinia())
app.use(router)

app.mount('#app')
