import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import TDesign from 'tdesign-vue-next'
import 'tdesign-vue-next/es/style/index.css'
import mitt from 'mitt'
import VCalendar from 'v-calendar'
import UndrawUi from 'undraw-ui'
import 'v-calendar/style.css'
import {
    // create naive ui
    create,
    // component
    NTabs, NTabPane, NMenu, NSplit
} from 'naive-ui'

import 'undraw-ui/dist/style.css'

// 通用字体
import 'vfonts/Lato.css'
// 等宽字体
import 'vfonts/FiraCode.css'


import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'


const Mit = mitt()

const naive = create({
    components: [NTabs,NTabPane,NMenu,NSplit]
})


declare module 'vue' {
    export interface ComponentCustomProperties {
        $Bus: typeof Mit
    }
}


const app = createApp(App)
app.config.globalProperties.$Bus = Mit
app.use(naive)
app.use(ElementPlus)
app.use(VCalendar, {})
app.use(TDesign)
app.use(createPinia())
app.use(router)
app.use(UndrawUi)
// app.use(ArcoVue);
app.mount('#app')
