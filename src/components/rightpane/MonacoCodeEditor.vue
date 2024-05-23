<template>
    <div class="code-editor" @dblclick="stopPropagationEvent">
        <MonacoEditor
            :code-value="codeValue"
            :options="currentOptions"
            :lang="currentLang"
            @update-code-value="getCodeValue"
            @on-code-blur="storeCurrentCodeValue"
            v-if="isGetCodeValue"
        ></MonacoEditor>
    </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import MonacoEditor from '@/components/rightpane/MonacoEditor.vue'
import { getCurrentInstance, onBeforeMount, ref, watch } from 'vue'
import type { Options } from '@/module/MonacoEditorType'
import prettier from 'prettier'
import * as javaPlugin from 'prettier-plugin-java'
import * as rustPlugin from 'prettier-plugin-rust'
import { UserInfoStore } from '@/stores/user-info'

const route = useRoute()
const PId = route.params.PId
const UId = ref<number>(0)
/*
* 用于防止未获取到本地代码值前去加载子组件 (由于Vue中子组件的 Mounted 在 父组件之前)
* 故若有父组件初始化时若有数据要传送至子组件, 则必须控制子组件后加载
*/
const isGetCodeValue = ref<boolean>(false) //

/* 编辑器配置 */
const codeValue = ref('')
const currentLang = ref<string>('rust')
const currentOptions = ref<Options>({
    fontSize: 16,
    tabSize: 4,
    theme: 'Default Light Modern'
})

const userInfoStore = UserInfoStore()
const getAndStoreConfig = async () => {
    // 获取编辑器配置
    const codeConfig = localStorage.getItem('code-config')
    if (codeConfig != null) {
        const configData = JSON.parse(codeConfig)
        currentLang.value = configData.lang
        currentOptions.value.fontSize = configData.fontSize
        currentOptions.value.tabSize = configData.tabSize
        currentOptions.value.theme = configData.theme
    }
    if (!userInfoStore.$state.isLogin) {
        await userInfoStore.getLoginUserInfo()
    }
    UId.value = userInfoStore.$state.loginUserInfo.userId
}
// setup 阶段立即执行, 防止首次加载缺失配置
;(async () => {
    await getAndStoreConfig()
})()

/* 组件挂载时先去 Local Store 中加载有无对应的 editor config, 防止刷新页面后失去当前配置 */
onBeforeMount(async () => {
    await getAndStoreConfig()
    const storeCodeValue = localStorage.getItem(
        `code-value-${PId}-${UId.value}-${currentLang.value}`
    )
    if (storeCodeValue != null) {
        codeValue.value = JSON.parse(storeCodeValue).code ?? ''
    }
    isGetCodeValue.value = true;
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

// 接受来自提交记录代码复制
currentComponentInstance?.proxy?.$Bus.on('copy-code-to-editor', (langAndCode: any) => {
    currentLang.value = langAndCode[0]
    codeValue.value = base64ToUtf8(langAndCode[1])
})

watch(currentLang, (newValue, oldValue) => {
    localStorage.setItem(`debug-res-${PId}-${UId.value}`, JSON.stringify([]))
    localStorage.setItem(`judge-res-${PId}-${UId.value}`, JSON.stringify({}))
    const storeCodeValue = localStorage.getItem(`code-value-${PId}-${UId.value}-${newValue}`)
    if (storeCodeValue != null) {
        codeValue.value = JSON.parse(storeCodeValue).code ?? ''
    } else {
        codeValue.value = ''
    }
})

const getCodeValue = (newCodeValue: string) => {
    codeValue.value = newCodeValue
    localStorage.setItem(
        `code-value-${PId}-${UId.value}-${currentLang.value}`,
        JSON.stringify({
            code: newCodeValue
        })
    )
    localStorage.setItem(`judge-res-${PId}-${UId.value}`, JSON.stringify({}))
    currentComponentInstance?.proxy?.$Bus.emit('code-change', 1)
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
