<template>
    <!--  代码编辑器设置  -->
    <div class="codeConfig" v-show="isDisplayCodeConfig" @dblclick="stopPropagationEvent">
        <!--   语言筛选器     -->
        <t-tooltip content="选择编程语言">
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
        </t-tooltip>

        <!--    题目模式    -->
        <!--   todo 后续有精力再加核心代码模式     -->
        <div style="margin-left: 5px; margin-right: 5px">
            <t-tooltip content="需手动编写输入输出, 注意输出格式">
                <t-button theme="default" variant="text" style="color: #7a7a7a; font-size: 14px">
                    <div style="color: #03bf80; font-size: 30px; padding-right: 3px">·</div>
                    ACM模式
                </t-button>
            </t-tooltip>
        </div>

        <!--    智能模式开关    -->
        <div style="margin-left: 5px; margin-right: 5px">
            <t-tooltip
                :content="`点击${isStartCurrentLangSmartTip == 1 ? '关闭' : '开启'}代码静态分析、语法提示、自动导包`"
            >
                <t-button
                    theme="default"
                    variant="text"
                    style="color: #7a7a7a; font-size: 14px"
                    @click="smartTipSwitch"
                    :loading="loadingStatus"
                >
                    <LightbulbIcon v-show="!loadingStatus" class="tipStyle" />
                    智能模式
                </t-button>
            </t-tooltip>
        </div>

        <div style="flex-grow: 1"></div>

        <div style="margin-left: 5px; margin-right: 3px">
            <t-tooltip content="运行你输入的样例">
                <t-button
                    theme="default"
                    variant="base"
                    class="runButton"
                    size="medium"
                    @click="runCodeRequest"
                    :disabled="submitLoading"
                    :loading="runLoading"
                >
                    <svg
                        v-show="!runLoading"
                        t="1711957905578"
                        class="icon"
                        viewBox="0 0 1756 1024"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        p-id="10588"
                        width="38"
                        height="38"
                    >
                        <path
                            d="M1220.672 487.107657c-0.215771-0.374857-0.453486-0.731429-0.676571-1.098971-6.266514-11.536457-16.010971-21.813029-28.692114-29.134629l-462.6944-267.136c-11.918629-6.880914-24.797257-10.203429-37.198629-10.296686-0.239543-0.003657-0.475429-0.020114-0.7168-0.020114-0.142629 0-0.2816 0.010971-0.424229 0.0128-0.778971 0.007314-1.552457 0.034743-2.327771 0.065829-0.164571 0.007314-0.329143 0.009143-0.493714 0.018286-20.598857 1.000229-39.416686 11.029943-49.634743 28.728686-4.885943 8.462629-7.259429 17.751771-7.389257 27.1488-0.751543 4.337371-1.155657 8.815543-1.155657 13.4016l0 534.273829c0 4.586057 0.404114 9.064229 1.155657 13.4016 0.129829 9.3952 2.505143 18.686171 7.389257 27.1488 10.218057 17.696914 29.034057 27.726629 49.632914 28.728686 0.1664 0.009143 0.334629 0.010971 0.501029 0.018286 0.771657 0.032914 1.543314 0.060343 2.320457 0.065829 0.142629 0.001829 0.2816 0.0128 0.424229 0.0128 0.241371 0 0.479086-0.018286 0.718629-0.020114 12.401371-0.095086 25.278171-3.4176 37.1968-10.296686l462.6944-267.136c12.682971-7.3216 22.4256-17.598171 28.692114-29.134629 0.223086-0.367543 0.4608-0.724114 0.676571-1.098971 5.176686-8.965486 7.533714-18.859886 7.389257-28.8256C1228.205714 505.967543 1225.848686 496.073143 1220.672 487.107657z"
                            fill="#686868"
                            p-id="10589"
                        ></path>
                    </svg>

                    <span class="runTipText">{{ runText }}</span>
                </t-button>
            </t-tooltip>
        </div>

        <div>
            <t-tooltip content="提交评测">
                <t-button
                    theme="default"
                    variant="base"
                    class="submitButton"
                    size="medium"
                    @click="submitCodeRequest"
                    :disabled="runLoading"
                    :loading="submitLoading"
                >
                    <svg
                        v-show="!submitLoading"
                        t="1711957728402"
                        class="submitIcon"
                        viewBox="0 0 1024 1024"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        p-id="8696"
                        width="24"
                        height="24"
                    >
                        <path
                            d="M512 128c-131.808 0-235.488 100.16-250.016 228a156.64 156.64 0 0 0-122.976 103.008C60.288 481.792 0 551.968 0 640c0 106.368 85.632 192 192 192h640c106.368 0 192-85.632 192-192 0-56.32-27.36-106.752-67.008-142.016-7.424-112.448-97.12-202.176-209.984-208C708.48 196.192 620.096 128 512 128z m0 64c88.384 0 159.072 56.672 184 136.992l7.008 23.008H736c88.16 0 160 71.84 160 160v16l12.992 10.016A130.336 130.336 0 0 1 960 640c0 72.832-55.168 128-128 128H192c-72.832 0-128-55.168-128-128a126.112 126.112 0 0 1 104.992-124.992l21.024-4 4-20.992C203.584 446.816 241.792 416 288 416h32v-32c0-107.84 84.16-192 192-192z m0 179.008l-23.008 21.984-128 128 46.016 46.016L480 493.984V704h64v-210.016l72.992 73.024 46.016-46.016-128-128-23.008-21.984z"
                            p-id="8697"
                            fill="#03BF80"
                        ></path>
                    </svg>
                    <span class="submitTipText">{{ submitText }}</span>
                </t-button>
            </t-tooltip>
        </div>

        <div style="flex-grow: 1"></div>

        <!--   代码编辑状态    -->
        <div style="margin-left: 5px; margin-right: 5px">
            <t-tooltip content="⚠️ 清空缓存会导致丢失数据">
                <t-button theme="default" variant="text" style="font-size: 13px; color: #7a7a7a">
                    <UnhappyIcon
                        style="color: #ea4c89; padding-top: 3px; margin-right: 3px"
                        v-show="!isStoreOrRecover && !isCoding"
                    />
                    <CheckCircleIcon
                        style="color: #03bf80; padding-top: 3px; margin-right: 3px"
                        v-show="isStoreOrRecover"
                    />
                    <Edit2Icon
                        style="color: #03bf80; padding-top: 3px; margin-right: 3px"
                        v-show="isCoding"
                    />
                    {{ storeStatusTip }}
                </t-button>
            </t-tooltip>
        </div>

        <!--   代码编辑器个性化设置    -->
        <div>
            <t-space>
                <t-tooltip content="编辑器设置">
                    <t-button
                        theme="default"
                        variant="text"
                        @click="visibleCenter = true"
                        shape="circle"
                    >
                        <Setting1Icon style="color: #7a7a7a" />
                    </t-button>
                </t-tooltip>
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
            <t-tooltip content="格式化代码">
                <t-button theme="default" variant="text" shape="circle" @click="codeFormat">
                    <FormatVerticalAlignLeftIcon style="color: #7a7a7a" />
                </t-button>
            </t-tooltip>
        </div>

        <t-popconfirm
            v-model="confirmVisible"
            theme="warning"
            content="重制后无法恢复当前编辑器内容"
            @confirm="resetCodeTemplate"
        >
            <div style="margin-left: 5px">
                <t-tooltip content="重制为代码模版">
                    <t-button theme="default" variant="text" shape="circle">
                        <RollfrontIcon style="color: #7a7a7a" />
                    </t-button>
                </t-tooltip>
            </div>
        </t-popconfirm>

        <!--   代码编辑器布局    -->
        <div style="margin-left: 5px; margin-right: 20px">
            <t-tooltip :content="isDisplayFullScreenIcon ? '沉浸布局' : '恢复布局'">
                <t-button theme="default" variant="text" shape="circle" @click="fullScreen">
                    <Fullscreen1Icon style="color: #7a7a7a" v-show="isDisplayFullScreenIcon" />
                    <FullscreenExit1Icon style="color: #7a7a7a" v-show="!isDisplayFullScreenIcon" />
                </t-button>
            </t-tooltip>
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
    RollfrontIcon,
    LightbulbIcon,
    UnhappyIcon
} from 'tdesign-icons-vue-next'
import { MessagePlugin, NotifyPlugin } from 'tdesign-vue-next'
import { useRoute } from 'vue-router'
import {
    type DebugSubmitRequest,
    JudgeControllerService,
    type JudgeSubmitRequest
} from '../../../apis'
import { utf8ToBase64 } from '@/utils/data-tackle'
import { Base64 } from 'js-base64'

/* 页面挂载时加载 Local Store 中的数据 ———— 防止刷新后的数据丢失 */
onMounted(() => {
    /* 获取编辑器设置, 若本地无数据, 则将默认值存至本地 */
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
    /* 获取是否开启智能提示, 若本地无数据, 则将默认值存至本地 */
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
    currentLang.value = value
    emitLangUpdate()
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
currentComponentInstance?.proxy?.$Bus.on('copy-code-to-editor', (langAndCode: any) => {
    handleUpdateCurrentLang(langAndCode[0])
})
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
        await NotifyPlugin.info({
            title: '已关闭智能模式',
            content: '手撕代码, 沉浸式无提示干扰写代码',
            placement: 'top-right'
        })
    }
    // 向 MonacoEditor 发送是否开启智能提示
    currentComponentInstance?.proxy?.$Bus.emit('code-tip-switch', isStartCurrentLangSmartTip.value)
}

watch(isStartCurrentLangSmartTip, (n) => {
    localStorage.setItem('code-tip', JSON.stringify(n))
})

// 接受 MonacoEditor 去开启智能提示的反馈信息
// todo 加一个定时器, 防止超时无反馈
currentComponentInstance?.proxy?.$Bus.on('switch-tip', (value: any) => {
    loadingStatus.value = false
    isStartCurrentLangSmartTip.value = value
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
        case 0:
            return '本地无代码哦'
        case 1:
            return '已从本地恢复'
        case 2:
            return '代码编辑中....'
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
    currentComponentInstance?.proxy?.$Bus.emit('on-code-format', currentLang.value)
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
/* 是否重制为模版代码 */
const confirmVisible = ref<boolean>(false)
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
    currentComponentInstance?.proxy?.$Bus.emit(
        'reset-code',
        adaptLangCodeTemplate(currentLang.value)
    )
}
/*----------------------------------------------------------------------------------------*/

// 阻止当前页面的双击事件向上冒泡
const stopPropagationEvent = (event: Event) => {
    event.stopPropagation()
}
/*----------------------------------------------------------------------------------------*/

const runLoading = ref<boolean>(false)
const submitLoading = ref<boolean>(false)
const runText = ref<string>('运行')
const submitText = ref<string>('提交')

/* style control */
const submitTextColor = ref<string>('#03BF80') // 运行时: #686868
const runButtonPT = ref<string>('8px') // 运行时 : 0
const runButtonPR = ref<string>('5px') // 运行时: 0

const runCodeButtonStyleChange = () => {
    runLoading.value = true
    runText.value = '判题中...'
    runButtonPT.value = '0'
    runButtonPR.value = '0'
}
const runCodeButtonRecoverStyle = () => {
    runLoading.value = false
    runText.value = '运行'
    runButtonPT.value = '8px'
    runButtonPR.value = '5px'
}
const submitCodeButtonStyleChange = () => {
    submitLoading.value = true
    submitTextColor.value = '#686868'
    submitText.value = '判题中...'
}
const submitCodeButtonRecoverStyle = () => {
    submitLoading.value = false
    submitTextColor.value = '#03BF80'
    submitText.value = '运行'
}

const currentCode = ref<string>('')
const currentTestCases = ref<string[]>([])
const route = useRoute()
const PId = route.params.PId
const UId = ref<number>(0)


const runCodeRequest = async () => {
    // 去本地获取自定义测试用例
    UId.value = Number(localStorage.getItem('current-login-uid')) ?? 0
    currentCode.value =
        JSON.parse(
            <string>localStorage.getItem(`code-value-${PId}-${UId.value}-${currentLang.value}`)
        )?.code ?? ''
    currentTestCases.value =
        JSON.parse(<string>localStorage.getItem(`test-case-${PId}-${UId.value}`)) ?? []
    if (currentCode.value == '') {
        await MessagePlugin.warning({
            content: '请输入代码'
        })
    } else if (currentTestCases.value.length == 0) {
        await MessagePlugin.warning({
            content: '请输入测试用例'
        })
    } else {
        runCodeButtonStyleChange()
        currentComponentInstance?.proxy?.$Bus.emit('debug-tabs', 2)
        const timeoutPromise = new Promise((resolve, reject) => {
            // 设置超时时间为8秒
            setTimeout(() => {
                reject(new Error('超时'))
            }, 8000)
        })


        const debugTask = JudgeControllerService.multiTestCaseDebug({
            problemId: Number(PId),
            testCases: currentTestCases.value.map((e, index) => {
                return { id: parseInt(String(index)) + 1, input: btoa(e), correctResult: '' }
            }),
            code: Base64.encode(currentCode.value),
            language: currentLang.value
        } as DebugSubmitRequest)

        // 竞争
        await Promise.race([debugTask, timeoutPromise])
            .then((res: any) => {
                if (res.statusCode === 0) {
                    currentComponentInstance?.proxy?.$Bus.emit('debug-code', res.data)
                } else {
                    MessagePlugin.error({
                        content: res.description
                    })
                }
            })
            .catch((err) => {
                if (err.message === '超时') {
                    MessagePlugin.error({
                        content: '评测机任务过载, 请稍后重试!!!'
                    })
                } else {
                    MessagePlugin.error({
                        content: err.message
                    })
                }
            })
            .finally(() => {
                runCodeButtonRecoverStyle()
            })
    }
}
const submitCodeRequest = async () => {
    // 从本地获取代码
    UId.value = Number(localStorage.getItem('current-login-uid')) ?? 0
    currentCode.value =
        JSON.parse(
            <string>localStorage.getItem(`code-value-${PId}-${UId.value}-${currentLang.value}`)
        )?.code ?? ''
    if (currentCode.value == '') {
        await MessagePlugin.warning({
            content: '请输入代码'
        })
    } else if (UId.value == 0) {
        await MessagePlugin.error({
            content: '请先登录'
        })
    } else {
        submitCodeButtonStyleChange()
        currentComponentInstance?.proxy?.$Bus.emit('debug-tabs', 3)
        // 设置超时时间为15秒
        const timeoutPromise = new Promise((resolve, reject) => {
            setTimeout(() => {
                reject(new Error('超时'))
            }, 15000)
        })

        const judgeTask = JudgeControllerService.judgeCode({
            userId: Number(UId.value),
            problemId: Number(PId),
            code: Base64.encode(currentCode.value),
            language: currentLang.value
        } as JudgeSubmitRequest)

        await Promise.race([judgeTask, timeoutPromise])
            .then((res: any) => {
                console.log(res)
                if (res.statusCode === 0) {
                    currentComponentInstance?.proxy?.$Bus.emit('judge-code', res.data)
                } else {
                    MessagePlugin.error({
                        content: res.description
                    })
                }
            })
            .catch((err) => {
                if (err.message === '超时') {
                    MessagePlugin.error({
                        content: '评测机任务过载, 请稍后重试!!!'
                    })
                } else {
                    MessagePlugin.error({
                        content: err.message
                    })
                }
            })
            .finally(() => {
                submitCodeButtonRecoverStyle()
            })
    }
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
    padding-top: 3px;
    color: v-bind(tipDisplayColor);
    font-size: 30px;
    padding-right: 4px;
}

.t-input__inner {
    color: #7a7a7a;
}

.t-input__wrap {
    border: none;
}

.runButton {
    background-color: #f3f3f3 !important;
    border: none !important;
    padding-left: 4px;
}

.runButton:hover {
    background-color: #e7e7e7 !important;
}

.submitButton {
    background-color: #f3f3f3 !important;
    border: none !important;
    padding-left: 4px;
}

.submitButton:hover {
    background-color: #e7e7e7 !important;
}

.runTipText {
    padding-top: v-bind(runButtonPT);
    padding-right: v-bind(runButtonPR);
    font-weight: bold;
    color: #686868;
}

.submitTipText {
    padding-top: 1px;
    margin-bottom: 1px;
    padding-right: 4px;
    color: v-bind(submitTextColor);
    font-weight: bold;
}

.submitIcon {
    padding-left: 12px;
    padding-right: 12px;
}
</style>
