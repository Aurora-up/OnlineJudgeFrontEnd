<template>
  <div>
    <div class="code-editor">
      <codemirror
        :phrases="phrases"
        v-model="code"
        placeholder="请输入你的代码..."
        :style="{ height: '540px' }"
        :autofocus="true"
        :indent-with-tab="true"
        :tab-size="2"
        :extensions="extensions"
        @change="console.log('change', $event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { type Ref, ref } from 'vue'
import { Codemirror } from 'vue-codemirror'
import { java } from '@codemirror/lang-java'

const langName = ref('java')
const langOptions = [
  { label: 'java', value: '1' },
  { label: 'cpp', value: '2' }
]

const code = ref<string>(
  'public class Main{\n' + '  public stastic void main(String arg) {\n' + '    \n' + '  }\n' + '}'
)
const extensions = [java()]

/**
 * 配置 code editor 中的 "功能说明" 显示为中文 (包括搜索显示显示, 悬停显示)
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
</script>
<style>
.code-editor {
  background-color: white;
  min-height: 90%;
  max-height: 92ch;
}

.cm-content {
  font-size: 16px;
}

.ͼ2 .cm-gutters {
  background-color: white;
  border: none;
}
</style>
