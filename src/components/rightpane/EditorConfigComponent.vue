<template>
    <!--  代码编辑器设置  -->
    <div class="codeConfig" v-show="isDisplayCodeConfig" @dblclick="stopPropagationEvent">
        <!--   语言筛选器     -->
        <t-select
            v-model="currentLang"
            :options="LangOptions"
            placeholder="语言"
            size="medium"
            borderless
            auto-width
            @change="handleUpdateCurrentLang"
            class="langSelect"
        ></t-select>

        <div style="margin-left: 5px; margin-right: 5px">
            <t-popup content="需手动编写输入输出, 注意输出格式" placement="top" trigger="hover">
                <t-button theme="default" variant="text" style="color: #7a7a7a; font-size: 14px">
                    <div style="color: #03bf80; font-size: 30px; padding-right: 3px">·</div>
                    ACM模式
                </t-button>
            </t-popup>
        </div>

        <!--    智能模式开关    -->
        <div style="margin-left: 5px; margin-right: 5px">
            <t-popup
                :content="`点击${isStartCurrentLangSmartTip == 1 ? '关闭' : '开启'}代码静态分析、语法提示、自动导包`"
                placement="top"
                trigger="hover"
            >
                <t-button
                    theme="default"
                    variant="text"
                    style="color: #7a7a7a; font-size: 14px"
                    @click="smartTipSwitch"
                    :loading="loadingStatus"
                >
                    <div v-show="!loadingStatus" class="tipStyle">·</div>
                    智能模式
                </t-button>
            </t-popup>
        </div>

        <div style="flex-grow: 1"></div>

        <!--   代码编辑状态    -->
        <div style="margin-left: 5px; margin-right: 5px">
            <t-popup content="⚠️ 清空缓存会导致丢失数据" placement="top" trigger="hover">
                <t-button theme="default" variant="text" style="font-size: 13px; color: #7a7a7a">
                    <CheckCircleIcon
                        style="color: #0d7a55; padding-top: 3px; margin-right: 3px"
                        v-show="isStoreOrRecover"
                    />
                    <Edit2Icon
                        style="color: #0052d9; padding-top: 3px; margin-right: 3px"
                        v-show="isCoding"
                    />
                    {{ storeStatusTip }}
                </t-button>
            </t-popup>
        </div>

        <!--   代码编辑器个性化设置    -->
        <div>
            <t-space>
                <t-popup content="编辑器设置" placement="top" trigger="hover">
                    <t-button
                        theme="default"
                        variant="text"
                        @click="visibleCenter = true"
                        shape="circle"
                    >
                        <Setting1Icon />
                    </t-button>
                </t-popup>
            </t-space>
            <!--   弹框 ——— 个性化设置    -->
            <t-dialog
                placement="center"
                header="代码编辑器设置"
                :visible="visibleCenter"
                :on-confirm="configConfirm"
                :on-close="configNo"
            >
                <t-select-input
                    label="字体大小"
                    :value="currentFontSize"
                    :popup-visible="FSVisible"
                    placeholder=""
                    auto-width
                    borderless
                    @popup-visible-change="FSonPopupVisibleChange"
                >
                    <template #panel>
                        <ul class="tdesign-demo__select-input-ul-auto-width">
                            <li
                                v-for="(item, index) in fontSizeOptions"
                                :key="index"
                                @click="() => FSonOptionClick(item)"
                            >
                                {{ item }}
                            </li>
                        </ul>
                    </template>
                    <template #suffixIcon>
                        <chevron-down-icon />
                    </template>
                </t-select-input>

                <!--   Monaco Editor Tab 长度设置     -->
                <t-select-input
                    label="Tab长度"
                    suffix="个空格"
                    :value="currentTabSize"
                    :popup-visible="TSVisible"
                    placeholder=""
                    auto-width
                    borderless
                    @popup-visible-change="TSonPopupVisibleChange"
                    style="margin-top: 10px"
                >
                    <template #panel>
                        <ul class="tdesign-demo__select-input-ul-auto-width">
                            <li
                                v-for="(item, index) in tabSizeOptions"
                                :key="index"
                                @click="() => TSonOptionClick(item)"
                            >
                                {{ item }}
                            </li>
                        </ul>
                    </template>
                    <template #suffixIcon>
                        <chevron-down-icon />
                    </template>
                </t-select-input>

                <t-select-input
                    label="主题"
                    :value="currentEditorTheme"
                    :popup-visible="ThemeOptionsVisible"
                    placeholder=""
                    auto-width
                    borderless
                    @popup-visible-change="ThemeOptionsPopupVisibleChange"
                    style="margin-top: 10px"
                >
                    <template #panel>
                        <ul class="tdesign-demo__select-input-ul-auto-width">
                            <li
                                v-for="(item, index) in themeOptions"
                                :key="index"
                                @click="() => ThemeOptionsOnOptionClick(item)"
                            >
                                {{ item }}
                            </li>
                        </ul>
                    </template>
                    <template #suffixIcon>
                        <chevron-down-icon />
                    </template>
                </t-select-input>
            </t-dialog>
        </div>

        <!--   代码格式化    -->
        <div style="margin-left: 5px">
            <t-popup content="格式化代码" placement="top" trigger="hover">
                <t-button theme="default" variant="text" shape="circle" @click="codeFormat">
                    <FormatVerticalAlignLeftIcon />
                </t-button>
            </t-popup>
        </div>

        <t-popconfirm
            v-model="visible2"
            theme="warning"
            content="重制后无法恢复当前编辑器内容"
            @confirm="resetCodeTemplate"
        >
            <div style="margin-left: 5px">
                <t-popup content="重制为代码模版" placement="top" trigger="hover">
                    <t-button theme="default" variant="text" shape="circle">
                        <RollfrontIcon />
                    </t-button>
                </t-popup>
            </div>
        </t-popconfirm>

        <!--   代码编辑器布局    -->
        <div style="margin-left: 5px; margin-right: 20px">
            <t-popup
                :content="isDisplayFullScreenIcon ? '沉浸布局' : '恢复布局'"
                placement="top"
                trigger="hover"
            >
                <t-button theme="default" variant="text" shape="circle" @click="fullScreen">
                    <Fullscreen1Icon v-show="isDisplayFullScreenIcon" />
                    <FullscreenExit1Icon v-show="!isDisplayFullScreenIcon" />
                </t-button>
            </t-popup>
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref, getCurrentInstance, onMounted, inject, type Ref, watch, computed } from 'vue'
import {
    ChevronDownIcon,
    Setting1Icon,
    CheckCircleIcon,
    FormatVerticalAlignLeftIcon,
    Fullscreen1Icon,
    FullscreenExit1Icon,
    Edit2Icon,
    RollfrontIcon
} from 'tdesign-icons-vue-next'
import { useRoute } from 'vue-router'
import { Event } from '@codingame/monaco-vscode-api/vscode/vs/base/common/event'
import { MessagePlugin } from 'tdesign-vue-next'

/* 页面挂载时加载 Local Store 中的数据 ———— 防止刷新后的数据丢失 */
onMounted(() => {
    // 获取编辑器设置
    const codeConfig = localStorage.getItem('code-config')
    if (codeConfig != null) {
        const configData = JSON.parse(codeConfig)
        currentLang.value = configData.lang
        currentFontSize.value = configData.fontSize
        currentTabSize.value = configData.tabSize
        currentEditorTheme.value = configData.theme
    } else {
        localStorage.setItem(
            'code-config',
            JSON.stringify({
                lang: currentLang.value,
                fontSize: currentFontSize.value,
                tabSize: currentTabSize.value,
                theme: currentEditorTheme.value
            })
        )
    }
    const codeTipConfig = localStorage.getItem('code-tip')
    if (codeTipConfig != null) {
        isStartCurrentLangSmartTip.value = Number(codeTipConfig)
        isStartCurrentLangSmartTip.value == 1
            ? (tipDisplayColor.value = '#03BF80')
            : (tipDisplayColor.value = '#EA4C89')
    } else {
        localStorage.setItem('code-tip', JSON.stringify(isStartCurrentLangSmartTip.value))
    }
})
/*----------------------------------------------------------------------------------------*/

/* 设置当前语言 */
const currentLang = ref<string>('java')
const LangOptions = [
    {
        label: 'Java',
        value: 'java'
    },
    {
        label: 'Rust',
        value: 'rust'
    },
    {
        label: 'C',
        value: 'c'
    },
    {
        label: 'C++',
        value: 'cpp'
    },
    {
        label: 'Python',
        value: 'python'
    }
]
const handleUpdateCurrentLang = (value: string) => {
    emitLangUpdate()
    currentLang.value = value
}
const currentComponentInstance = getCurrentInstance()
const emitLangUpdate = () => {
    /* 将 Editor Config 传给 MonacoCodeEditor 组件 */
    currentComponentInstance?.proxy?.$Bus.emit('on-editor-config', [
        currentLang.value,
        currentFontSize.value,
        currentTabSize.value,
        currentEditorTheme.value
    ])
}
/*----------------------------------------------------------------------------------------*/

/* 设置当前字体大小 */
const fontSizeOptions: number[] = [14, 16, 18, 20]
const currentFontSize = ref<number>(16)
const FSVisible = ref(false)
const FSonOptionClick = (item: number) => {
    currentFontSize.value = item
    // 选中后立即关闭浮层
    FSVisible.value = false
}
const FSonPopupVisibleChange = (val: boolean) => {
    FSVisible.value = val
}
/*----------------------------------------------------------------------------------------*/

/* 设置当前编辑器中 Tab 键所占空格数 */
const tabSizeOptions: number[] = [2, 4]
const currentTabSize = ref<number>(4)
const TSVisible = ref(false)
const TSonOptionClick = (item: number) => {
    currentTabSize.value = item
    // 选中后立即关闭浮层
    TSVisible.value = false
}
const TSonPopupVisibleChange = (val: boolean) => {
    TSVisible.value = val
}
/*----------------------------------------------------------------------------------------*/

/* 设置当前 Monaco Editor 主题 */
const themeOptions: string[] = [
    'Default Light Modern',
    'Default Dark Modern',
    'Default High Contrast Light',
    'Default High Contrast'
]
const currentEditorTheme = ref<string>('Default Light Modern')
const ThemeOptionsVisible = ref(false)
const ThemeOptionsOnOptionClick = (item: string) => {
    currentEditorTheme.value = item
    // 选中后立即关闭浮层
    ThemeOptionsVisible.value = false
}
const ThemeOptionsPopupVisibleChange = (val: boolean) => {
    ThemeOptionsVisible.value = val
}
/*----------------------------------------------------------------------------------------*/

/* 弹出的 monacoEditor 设置对话框的确实和取消 */
const visibleCenter = ref(false)
const configConfirm = () => {
    // 确认
    visibleCenter.value = false
    emitLangUpdate() // 发送给 CodeEditor 组件相关设置信息
}
const configNo = () => {
    // 取消
    visibleCenter.value = false
}
/*----------------------------------------------------------------------------------------*/

/* 控制左右拖拽时是否显示 Code Config ———— 接收 QuestionView 组件传来的信息 */
const isDisplayCodeConfig = inject<Ref<boolean>>('isDisplayCodeConfig')

/*----------------------------------------------------------------------------------------*/

// 默认不开启当前语言的智能提示
const isStartCurrentLangSmartTip = ref<number>(0) // 0 是关闭, 1 开启
const tipDisplayColor = ref<string>('#EA4C89')
const loadingStatus = ref<boolean>(false)

const smartTipSwitch = async () => {
    loadingStatus.value = true
    if (isStartCurrentLangSmartTip.value == 0) {
        isStartCurrentLangSmartTip.value = 1
    } else {
        isStartCurrentLangSmartTip.value = 0
    }
    currentComponentInstance?.proxy?.$Bus.emit('code-tip-switch', isStartCurrentLangSmartTip.value)
    localStorage.setItem('code-tip', JSON.stringify(isStartCurrentLangSmartTip.value))
}
currentComponentInstance?.proxy?.$Bus.on('switch-tip', (value: any) => {
    loadingStatus.value = false
    isStartCurrentLangSmartTip.value = value

    if (value == 0) {
        MessagePlugin.info({ content: '已关闭智能模式', placement: 'top' })
    } else {
        MessagePlugin.success({ content: '已开启智能模式', placement: 'top' })
    }

    isStartCurrentLangSmartTip.value == 1
        ? (tipDisplayColor.value = '#03BF80')
        : (tipDisplayColor.value = '#EA4C89')
})

/*----------------------------------------------------------------------------------------*/

/**
 * 0: 无状态       -- 编辑器没有获取焦点并且本地没有存储的代码
 * 1: 已从本地恢复  -- 编辑器没有获取焦点并且本地有存储的代码
 * 2: 代码编辑中... -- 编辑器获取了焦点
 * 3: 已存储至本地  -- 编辑器失去焦点且本地有代码
 */
const codeStoreStatus = ref<number>(0)
const isCoding = ref<boolean>(false) // 是否为代码编辑状态 (编辑器是否获取焦点)
const isStoreOrRecover = ref<boolean>(false) // 是否将代码存储至本地 LocalStore 中
/* 根据状态控制 isCoding 和 isStoreOrRecover 再而控制图标的显隐 */
watch(codeStoreStatus, (n) => {
    if (n == 1 || n == 3) {
        isStoreOrRecover.value = true
        isCoding.value = false
    } else if (n == 2) {
        isCoding.value = true
        isStoreOrRecover.value = false
    } else {
        isCoding.value = false
        isStoreOrRecover.value = false
    }
})
const storeStatusTip = computed(() => {
    switch (codeStoreStatus.value) {
        case 1:
            return '已从本地恢复'
        case 2:
            return '代码编辑中...'
        case 3:
            return '已存储至本地'
        default:
            return ''
    }
})
currentComponentInstance?.proxy?.$Bus.on('on-editor-blur', (value: any) => {
    codeStoreStatus.value = value[0]
})
/*----------------------------------------------------------------------------------------*/

const codeFormat = () => {
    currentComponentInstance?.proxy?.$Bus.emit('on-code-format', [currentLang.value])
}
/*----------------------------------------------------------------------------------------*/

// 是否显示 "放大" 图标
const isDisplayFullScreenIcon = ref<boolean>(true)
const emitFullScreen = defineEmits(['on-full-screen'])
const fullScreen = () => {
    emitFullScreen('on-full-screen', isDisplayFullScreenIcon.value)
    isDisplayFullScreenIcon.value = !isDisplayFullScreenIcon.value
}
/*----------------------------------------------------------------------------------------*/

const visible2 = ref<boolean>(false)
const adaptLangCodeTemplate = (lang: string): string => {
    const mp = new Map<string, string>()
    mp.set('python', '')
    mp.set(
        'java',
        `public class Main {
    public static void main(String[] args) {

    }
}`
    )
    mp.set(
        'rust',
        `fn main() {

}`
    )
    mp.set(
        'cpp',
        `#include <iostream>
using namespace std;

int main() {

    return 0;
}`
    )
    mp.set(
        'c',
        `#include <stdio.h>

int main () {

    return 0;
}`
    )
    if (mp.has(lang)) {
        return mp.get(lang) ?? ''
    }
    return ''
}

// 重制为代码模版
const resetCodeTemplate = () => {
    console.log('111')
    currentComponentInstance?.proxy?.$Bus.emit(
        'reset-code',
        adaptLangCodeTemplate(currentLang.value)
    )
}

// 阻止当前页面的双击事件向上冒泡
const stopPropagationEvent = (event: Event) => {
    event.stopPropagation()
}
</script>
<style>
.tdesign-demo__select-input-ul-auto-width {
    padding: 2px 0;
    margin: 0 -2px;
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.tdesign-demo__select-input-ul-auto-width > li {
    display: block;
    border-radius: 3px;
    line-height: 22px;
    cursor: pointer;
    padding: 3px 8px;
    color: var(--td-text-color-primary);
    transition: background-color 0.2s linear;
    white-space: nowrap;
    word-wrap: normal;
    overflow: hidden;
    text-overflow: ellipsis;
}

.tdesign-demo__select-input-ul-auto-width > li:hover {
    background-color: var(--td-bg-color-container-hover);
}

.codeConfig {
    margin-top: 1px;
    width: 100%;
    height: 100%;
    display: flex;
    flex-wrap: wrap;
    border-bottom: 1px solid #e8e8e8;
}

.langSelect {
    width: 80px;
    border-radius: 10px;
    color: #7a7a7a;
    margin-left: 3px;
}

.tipStyle {
    color: v-bind(tipDisplayColor);
    font-size: 30px;
    padding-right: 3px;
}

.t-input__inner {
    color: #7a7a7a;
}
</style>
