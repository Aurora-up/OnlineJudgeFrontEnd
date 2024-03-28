<template>
    <div class="code-editor">
        <MonacoEditor
            :code-value="codeValue"
            :options="currentOptions"
            :lang="currentLang"
            @update-code-value="getCodeValue"
        ></MonacoEditor>
    </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import MonacoEditor from '@/components/rightpane/MonacoEditor.vue'
import { getCurrentInstance, onMounted, ref, watch } from 'vue'
import type { Options } from '@/module/MonacoEditorType'

const route = useRoute()
const PId = route.params.PId

const codeValue = ref('')
const currentLang = ref<string>('rust')
const currentOptions = ref<Options>({
    fontSize: 16,
    tabSize: 4,
    theme: 'Default Light Modern'
})

const getAndStoreConfig = () => {
    const codeConfig = localStorage.getItem('code-config')
    if (codeConfig != null) {
        const configData = JSON.parse(codeConfig)
        currentLang.value = configData.lang
        currentOptions.value.fontSize = configData.fontSize
        currentOptions.value.tabSize = configData.tabSize
        currentOptions.value.theme = configData.theme
    }
    // todo 还需添加 UId
    const storeCodeValue = localStorage.getItem(`code-value-${PId}-${currentLang.value}`)
    if (storeCodeValue != null) {
        codeValue.value = JSON.parse(storeCodeValue).code ?? ''
    }
}
getAndStoreConfig()

/* 组件初始化时先去 Local Store 中加载有无对应的 editor config, 防止刷新页面后失去当前配置 */
onMounted(() => {
    getAndStoreConfig()
})

/* 接收 Code Config */
const currentComponentInstance = getCurrentInstance()
currentComponentInstance?.proxy?.$Bus.on('on-editor-config', (configs: any) => {
    currentLang.value = configs[0].value
    currentOptions.value.fontSize = configs[1].value
    currentOptions.value.tabSize = configs[2].value
    currentOptions.value.theme = configs[3].value
    // 拿到对应的设置后先写入 Local Store , 防止刷新页面后失去当前配置
    localStorage.setItem(
        'code-config',
        JSON.stringify({
            lang: currentLang.value,
            fontSize: currentOptions.value.fontSize,
            tabSize: currentOptions.value.tabSize,
            theme: currentOptions.value.theme
        })
    )
})

watch(currentLang, (newValue) => {
    // todo 还需添加 UId
    const storeCodeValue = localStorage.getItem(`code-value-${PId}-${newValue}`)
    if (storeCodeValue != null) {
        codeValue.value = JSON.parse(storeCodeValue).code ?? ''
    } else {
        codeValue.value = ''
    }
})

const getCodeValue = (newCodeValue: string) => {
    localStorage.setItem(
        `code-value-${PId}-${currentLang.value}`,
        JSON.stringify({
            code: newCodeValue
        })
    )
}
</script>

<style>
.code-editor {
    min-height: 100%;
    height: 100%;
    width: 100%;
}
</style>
