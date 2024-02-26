<template>
  <div ref="codeEditBox" class="codeEditBox"/>
</template>
<script lang="ts">
import { defineComponent, inject, onBeforeUnmount, onMounted, type Ref, ref, watch } from 'vue'

import * as monaco from 'monaco-editor'
import { language as javaLanguage } from 'monaco-editor/esm/vs/basic-languages/java/java.js'
import { language as cppLanguage } from 'monaco-editor/esm/vs/basic-languages/cpp/cpp.js'
import { language as rustLanguage } from 'monaco-editor/esm/vs/basic-languages/rust/rust.js'
import { language as pythonLanguage } from 'monaco-editor/esm/vs/basic-languages/python/python.js'
import 'monaco-editor/esm/vs/basic-languages/java/java.contribution'
import 'monaco-editor/esm/vs/basic-languages/cpp/cpp.contribution'
import 'monaco-editor/esm/vs/basic-languages/python/python.contribution'
import 'monaco-editor/esm/vs/basic-languages/rust/rust.contribution'

import { editorProps } from './monacoEditorType'

export default defineComponent({
  name: 'MonacoEditor',
  props: editorProps,
  emits: ['update:modelValue', 'change', 'editor-mounted'],
  setup(props, { emit }) {
    (self as any).MonacoEnvironment = {
      getWorker: (_: string, label: string) => {
        const getWorkerModule = (moduleUrl: string, label: string) =>
          new Worker((self as any).MonacoEnvironment.getWorkerUrl(moduleUrl), {
            name: label,
            type: 'module'
          })
        switch (label) {
          case 'c':
          case 'cpp':
            return getWorkerModule('/monaco-editor/esm/vs/language/cpp/cpp.worker?worker', label)
          case 'java':
            return getWorkerModule('/monaco-editor/esm/vs/language/java/java.worker?worker', label)
          case 'rust':
            return getWorkerModule('/monaco-editor/esm/vs/language/rust/rust.worker?worker', label)
          case 'python':
            return getWorkerModule('/monaco-editor/esm/vs/language/python/python.worker?worker', label)
          default:
            return getWorkerModule('/monaco-editor/esm/vs/editor/editor.worker?worker', label)
        }
      }
    }
    let editor: any
    const codeEditBox = ref()

    const init = () => {
      monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
        noSemanticValidation: true,
        noSyntaxValidation: false
      })
      monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
        target: monaco.languages.typescript.ScriptTarget.ES2020,
        allowNonTsExtensions: true
      })

      // 配置编程语言初始化
      monaco.languages.registerCompletionItemProvider('java', {
        provideCompletionItems() {
          const suggestions: any = []
          javaLanguage.keywords.forEach((item: any) => {
            suggestions.push({
              label: item,
              kind: monaco.languages.CompletionItemKind.Keyword,
              insertText: item
            })
          })
          return {
            suggestions
          }
        }
      })
      monaco.languages.registerCompletionItemProvider('cpp', {
        provideCompletionItems() {
          const suggestions: any = []
          cppLanguage.keywords.forEach((item: any) => {
            suggestions.push({
              label: item,
              kind: monaco.languages.CompletionItemKind.Keyword,
              insertText: item
            })
          })
          return {
            suggestions
          }
        }
      })
      monaco.languages.registerCompletionItemProvider('c', {
        provideCompletionItems() {
          const suggestions: any = []
          cppLanguage.keywords.forEach((item: any) => {
            suggestions.push({
              label: item,
              kind: monaco.languages.CompletionItemKind.Keyword,
              insertText: item
            })
          })
          return {
            suggestions
          }
        }
      })
      monaco.languages.registerCompletionItemProvider('rust', {
        provideCompletionItems() {
          const suggestions: any = []
          rustLanguage.keywords.forEach((item: any) => {
            suggestions.push({
              label: item,
              kind: monaco.languages.CompletionItemKind.Keyword,
              insertText: item
            })
          })
          return {
            suggestions
          }
        }
      })
      monaco.languages.registerCompletionItemProvider('python', {
        provideCompletionItems() {
          const suggestions: any = []
          pythonLanguage.keywords.forEach((item: any) => {
            suggestions.push({
              label: item,
              kind: monaco.languages.CompletionItemKind.Keyword,
              insertText: item
            })
          })
          return {
            suggestions
          }
        }
      })


      editor = monaco.editor.create(codeEditBox.value, {
        value: props.modelValue,
        language: props.language,
        readOnly: props.readOnly,
        theme: props.theme,
        ...props.options
      })

      // 监听值的变化
      editor.onDidChangeModelContent(() => {
        const value = editor.getValue() // 给父组件实时返回最新文本
        emit('update:modelValue', value)
        emit('change', value)
      })

      emit('editor-mounted', editor)
    }
    watch(
      () => props.modelValue,
      (newValue) => {
        if (editor) {
          const value = editor.getValue()
          if (newValue !== value) {
            editor.setValue(newValue)
          }
        }
      }
    )

    watch(
      () => props.options,
      (newValue) => {
        editor.updateOptions(newValue)
      },
      { deep: true }
    )

    watch(
      () => props.readOnly,
      () => {
        editor.updateOptions({ readOnly: props.readOnly })
      },
      { deep: true }
    )

    watch(
      () => props.language,
      (newValue) => {
        monaco.editor.setModelLanguage(editor.getModel()!, newValue)
      }
    )

    watch(() => props.theme, (newTheme) => {
      if (editor) {
        editor.updateOptions({ theme: newTheme });
      }
    });

    onBeforeUnmount(() => {
      editor.dispose()
    })

    onMounted(() => {
      init()
    })

    /* 接收来自 QuestionView 中 "拖拽" 或 "双击" 后同步 Code mirror 组件高度的设置 */
    const CodeHeightVH = inject<Ref<string>>('CodeHeightVH')
    const codeHeightVH = ref(CodeHeightVH);

    // 监听 CodeHeightVH 的变化
    watch(codeHeightVH, (newHeight) => {
      if (editor && newHeight) {
        codeEditBox.value.style.height = newHeight;
        codeEditBox.value.style.width = "100%";
        editor.layout(); // 通知 Monaco 重新布局
      }
    });

    const CodeWidthIsChange = inject<Ref<boolean>>('codeWidthIsChange')
    const codeWidthIsChange = ref(CodeWidthIsChange);
    // 监听 CodeHeightVH 的变化
    watch(codeWidthIsChange, (newHeight) => {
      if (editor && newHeight != null) {
        codeEditBox.value.style.width = "100%";
        editor.layout(); // 通知 Monaco 重新布局
      }
    });

    return { codeEditBox, codeHeightVH }
  }
})
</script>
<style lang="scss">
.codeEditBox {
  width: 100%;
  flex: 1;
  min-height: 100%;
  overflow: hidden;
  height: v-bind(codeHeightVH);
}
</style>
