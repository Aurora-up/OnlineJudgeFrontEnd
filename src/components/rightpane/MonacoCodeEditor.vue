<template>
  <div class="code-editor">
    <monacoEditor
      v-model="codeValue"
      :language="currentLang"
      :height-change="true"
      :read-only="false"
      @editor-mounted="editorMounted"
      :options="editorOption"
      :theme="currentEditorTheme"
      :height="CodeHeightVH"
      width="100%"
    />
  </div>
</template>

<script setup lang="ts">
import monacoEditor from '@/components/rightpane/MonacoEditor.vue'
import { getCurrentInstance, inject, onMounted, type Ref, ref, watch } from 'vue'

const currentLang = ref<string>('rust')
const currentFontSize = ref<number>(14)
const currentTabSize = ref<number>(4)
const currentEditorTheme = ref<string>('hc-light');


/* 组件初始化时先去 Local Store 中加载有无对应的 editor config, 防止刷新页面后失去当前配置 */
onMounted(() => {
  const codeConfig = localStorage.getItem('code-config')
  if (codeConfig != null) {
    const configData = JSON.parse(codeConfig)
    currentLang.value = configData.lang
    currentFontSize.value = configData.fontSize
    currentTabSize.value = configData.tabSize
    currentEditorTheme.value = configData.theme
  }
  console.log("当前主题" + currentEditorTheme.value);
})


const currentComponentInstance = getCurrentInstance()
currentComponentInstance?.proxy?.$Bus.on('on-editor-config', (configs: any) => {
  currentLang.value = configs[0].value ?? 'rust'
  currentFontSize.value = configs[1].value ?? 14
  currentTabSize.value = configs[2].value ?? 2
  currentEditorTheme.value = configs[3].value ?? "hc-light"
  // 拿到对应的设置后先写入 Local Store , 防止刷新页面后失去当前配置
  localStorage.setItem(
    'code-config',
    JSON.stringify({
      lang: currentLang.value,
      fontSize: currentFontSize.value,
      tabSize: currentTabSize.value,
      theme: currentEditorTheme.value
    })
  )
})


const codeValue = ref('')
const editorOption = ref({
  tabSize: currentTabSize,
  fontSize: currentFontSize
})


watch(codeValue, (newValue, oldValue) => {
  console.log(newValue)
})

const editorMounted = (editor: any) => {}

/* 接收来自 QuestionView 中 "拖拽" 或 "双击" 后同步 Code mirror 组件高度的设置 */
const CodeHeightVH = inject<Ref<string>>('CodeHeightVH')
</script>

<style>
.code-editor {
  min-height: 100%;
  height: 100%;
  width: 100%;
}
</style>
