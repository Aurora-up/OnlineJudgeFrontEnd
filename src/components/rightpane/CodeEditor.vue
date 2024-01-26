<template>
  <div class="code-editor">
    <codemirror
      :phrases="phrases"
      v-model="code"
      placeholder="请输入你的代码..."
      :autofocus="true"
      :indent-with-tab="true"
      :tab-size="currentTabSize"
      :extensions="extensions"
      @change="console.log('change', $event)"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, getCurrentInstance, inject, onMounted, type Ref, ref } from 'vue'
import { Codemirror } from 'vue-codemirror'
import { java } from '@codemirror/lang-java'
import { cpp } from '@codemirror/lang-cpp'
import { rust } from '@codemirror/lang-rust'

// 默认的代码模版
const codeTemplate = [
  {
    name: 'java',
    lang: java(),
    template: `public class Main{
  public void static main(String arg) {

  }
}`
  },
  {
    name: 'cpp',
    lang: cpp(),
    template: `#include <iostream>
int main() {

  return 0;
}`
  },
  {
    name: 'rust',
    lang: rust(),
    template: `fn main() {

}`
  }
]

const code = ref<string>()

// 根据选择的不同的语言去告知 Code mirror 达到不同语言的代码高亮的正确
const extensions = computed(() => {
  const result: any = []
  if (currentLang.value) {
    codeTemplate.forEach((item) => {
      if (item.name == currentLang.value) {
        result.push(item.lang)
        code.value = item.template
      }
    })
  }
  return result
})


/**
 * 配置 code editor 中的 "功能说明" 显示为中文 (包括搜索显示, 悬停显示)
 * @see {@link https://codemirror.net/6/examples/translate/ | Example: Internationalization}
 */
const phrases: Ref<Record<string, string>> = ref({
  // @codemirror/view
  'Control character': '控制字符',
  // @codemirror/commands
  'Selection deleted': '选择已删除',
  // @codemirror/language
  'Folded lines': '折叠的行',
  'Unfolded lines': '展开的行',
  to: '至',
  'folded code': '折叠的代码',
  unfold: '取消折叠',
  'Fold line': '折叠行',
  'Unfold line': '取消折叠行',
  // @codemirror/search
  'Go to line': '跳转至行',
  go: '确定',
  Find: '查找',
  Replace: '替换',
  next: '▼',
  previous: '▲',
  all: '全部',
  'match case': '区分大小写',
  'by word': '按单词',
  regexp: '正则表达式',
  replace: '替换',
  'replace all': '替换全部',
  close: '关闭',
  'current match': '当前匹配',
  'replaced $ matches': '已替换 $ 处匹配',
  'replaced match on line $': '已替换第 $ 行匹配',
  'on line': '在行',
  // @codemirror/autocomplete
  Completions: '自动补全',
  // @codemirror/lint
  Diagnostics: '诊断',
  'No diagnostics': '无诊断'
})

/* 接收来自 QuestionView 中 "拖拽" 或 "双击" 后同步 Code mirror 组件高度的设置 */
const CodeHeightVH = inject<Ref<string>>('CodeHeightVH')

const currentLang = ref<string>('java')
const currentFontSize = ref<string>('16px')
const currentTabSize = ref<number>(2)
const isRecoverCodeTemplate = ref<boolean>(false)

/* 组件初始话时先去 Local Store 中加载有无对应的 code config, 防止刷新页面后失去当前配置 */
onMounted(() => {
  const codeConfig = localStorage.getItem('code-config')
  if (codeConfig != null) {
    const configData = JSON.parse(codeConfig)
    currentLang.value = configData.lang
    currentFontSize.value = configData.fontSize
    currentTabSize.value = configData.tabSize
  }
})

const currentComponentInstance = getCurrentInstance()
currentComponentInstance?.proxy?.$Bus.on('on-editor-config', (configs: any) => {
  currentLang.value = configs[0].value ?? 'java'
  currentFontSize.value = configs[1].value ?? '16px'
  currentTabSize.value = configs[2].value ?? 2
  isRecoverCodeTemplate.value = configs[3].value ?? false
  // 拿到对应的设置后先写入 Local Store , 防止刷新页面后失去当前配置
  localStorage.setItem(
    'code-config',
    JSON.stringify({
      lang: currentLang.value,
      fontSize: currentFontSize.value,
      tabSize: currentTabSize.value
    })
  )
  // console.log(currentLang.value, currentFontSize.value, currentTabSize.value, isRecoverCodeTemplate.value)
  // 若重置了当前代码, 则去匹配对应的代码模版
  if (isRecoverCodeTemplate.value) {
    codeTemplate.forEach((item) => {
      if (item.name == currentLang.value) {
        code.value = item.template
      }
    })
  }
})
</script>
<style>
.code-editor {
  background-color: white;
  min-height: 100%;
  height: v-bind(CodeHeightVH);
}

.cm-content {
  font-size: v-bind(currentFontSize);
}

.ͼ2 .cm-gutters {
  background-color: white;
  border: none;
}

.cm-gutterElement {
  font-size: v-bind(currentFontSize);
}


.cm-editor ͼ1 ͼ2 ͼ4 ͼ4t {
  overflow: auto;
}

</style>
