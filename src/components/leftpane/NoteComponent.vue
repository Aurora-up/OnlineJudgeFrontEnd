<template>
    <MdEditor
        v-model="text"
        previewTheme="cyanosis"
        :autoDetectCode="true"
        :showCodeRowNumber="true"
        :placeholder="`支持 markdown 语法...`"
        :preview="false"
        :toolbars="tool"
        @onSave="onSave"
        @onError="onError"
        @onBlur="onBlur"
    />
    <div></div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { MdEditor } from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'

const text = ref()

// 监听文本输入
watch(text, (newVal, oldVal) => {
    console.log(newVal, oldVal)
})
// 文本保存
const onSave = (text: string, htmlText: any) => {
    console.log(text)

    htmlText.then((h) => {
        console.log(h)
    })
}

// 错误处理
const onError = (err) => {
    alert(err.message)
}

//  编辑器失去焦点时
const onBlur = (e) => {
    console.log('是否保存笔记?', e)
}

/* 工具展示 */
const tool = ref([
    'bold',
    'underline',
    'italic',
    '-',
    'title',
    'strikeThrough',
    'sub',
    'sup',
    'task',
    '-',
    'codeRow',
    'code',
    'link',
    'image',
    'table',
    'mermaid',
    'katex',
    '-',
    'revoke',
    'next',
    'save',
    '-',
    'pageFullscreen',
    'fullscreen',
    'preview',
    'catalog'
])
</script>

<style scoped>
.md-editor {
    height: 87vh;
}
</style>
