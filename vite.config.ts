import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from "@vitejs/plugin-vue-jsx";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  optimizeDeps: {
    include: [
      `monaco-editor/esm/vs/language/json/json.worker`,
      `monaco-editor/esm/vs/language/css/css.worker`,
      `monaco-editor/esm/vs/language/html/html.worker`,
      `monaco-editor/esm/vs/language/typescript/ts.worker`,
      `monaco-editor/esm/vs/editor/editor.worker`
    ],
  },
  // server: {
  //   // 定义代理规则
  //   proxy: {
  //     // 代理目标，这里是你的后端服务器地址
  //     '/twikooApi': {
  //       target: 'https://aurora-up-oj-comment.hf.space',
  //       changeOrigin: true, // 是否更改请求源
  //       rewrite: (path) => path.replace(/^\/api/, ''), // 如果后端服务器不需要/api前缀，可以在这里重写路径
  //     },
  //   },
  //   // 其他服务器配置...
  // },
})
