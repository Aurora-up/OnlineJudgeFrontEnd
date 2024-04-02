<template>
    <div class="code-editor" @dblclick="stopPropagationEvent">
        <MonacoEditor
            :code-value="codeValue"
            :options="currentOptions"
            :lang="currentLang"
            @update-code-value="getCodeValue"
            @on-code-blur="storeCurrentCodeValue"
        ></MonacoEditor>
    </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import MonacoEditor from '@/components/rightpane/MonacoEditor.vue'
import { getCurrentInstance, onMounted, ref, watch } from 'vue'
import type { Options } from '@/module/MonacoEditorType'
import prettier from "prettier";
import * as javaPlugin from "prettier-plugin-java"
import * as rustPlugin from "prettier-plugin-rust";


const route = useRoute()
const PId = route.params.PId

/* 编辑器配置 */
const codeValue = ref('')
const currentLang = ref<string>('rust')
const currentOptions = ref<Options>({
    fontSize: 16,
    tabSize: 4,
    theme: 'Default Light Modern'
})

const getAndStoreConfig = () => {
    // 获取编辑器配置
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
// setup 阶段立即执行, 防止首次加载缺失配置
getAndStoreConfig()

/* 组件挂载时先去 Local Store 中加载有无对应的 editor config, 防止刷新页面后失去当前配置 */
onMounted(() => {
    getAndStoreConfig()
    let storeStatus: number = 0
    // 已从本地恢复存储的代码
    if (codeValue.value != '') {
        storeStatus = 1
    }
    currentComponentInstance?.proxy?.$Bus.emit('on-editor-blur', [storeStatus])
})

/* 接收 Code Config */
const currentComponentInstance = getCurrentInstance()
currentComponentInstance?.proxy?.$Bus.on('on-editor-config', (configs: any) => {
    currentLang.value = configs[0]
    currentOptions.value.fontSize = configs[1]
    currentOptions.value.tabSize = configs[2]
    currentOptions.value.theme = configs[3]
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

// todo 代码格式化
currentComponentInstance?.proxy?.$Bus.on('on-code-format', (lang: any) => {
    prettier.format(codeValue.value, {
        parser: lang,
        plugins: [rustPlugin, javaPlugin],
        tabWidth: currentOptions.value.tabSize
    })
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
    codeValue.value = newCodeValue
    localStorage.setItem(
        `code-value-${PId}-${currentLang.value}`,
        JSON.stringify({
            code: newCodeValue
        })
    )
}

const storeCurrentCodeValue = (isEditorForce: boolean) => {
    let storeStatus: number = 0
    if (isEditorForce) {
        // 正在编辑中
        storeStatus = 2
    } else if (!isEditorForce && codeValue.value != '') {
        // 失去焦点并且有代码
        storeStatus = 3
    }
    currentComponentInstance?.proxy?.$Bus.emit('on-editor-blur', [storeStatus])
}

const stopPropagationEvent = (event: Event) => {
    event.stopPropagation()
}
</script>

<style>
.code-editor {
    min-height: 100%;
    height: 100%;
    width: 100%;
}
</style>
