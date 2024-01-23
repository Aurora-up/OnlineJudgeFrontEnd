// import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { basicSetup } from 'codemirror'
import VueCodemirror from 'vue-codemirror'

import App from './App.vue'
import router from './router'

import TDesign from 'tdesign-vue-next';
import 'tdesign-vue-next/es/style/index.css';


const app = createApp(App)


app.use(TDesign)

app.use(createPinia())
app.use(router)
app.use(VueCodemirror, {
  // optional default global options
  autofocus: true,
  disabled: false,
  indentWithTab: true,
  tabSize: 2,
  placeholder: 'Code goes here...',
  extensions: [basicSetup],
  // ...
})

app.mount('#app')
