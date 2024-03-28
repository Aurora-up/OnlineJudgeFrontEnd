<template>
    <div class="codeConfig" v-show="isDisplayCodeConfig && isDisplay">
        <div style="flex-grow: 1"></div>
        <t-select-input
            :value="ConvertLangValue(currentLang)"
            :popup-visible="popupVisible"
            placeholder="lang"
            auto-width
            borderless
            size="small"
            @popup-visible-change="onPopupVisibleChange"
            class="langSelect"
        >
            <template #panel>
                <ul class="tdesign-demo__select-input-ul-auto-width">
                    <li
                        v-for="(item, index) in langOptions"
                        :key="index"
                        @click="() => onLangOptionClick(String(item))"
                    >
                        {{ item }}
                    </li>
                </ul>
            </template>
            <template #suffixIcon>
                <chevron-down-icon />
            </template>
        </t-select-input>
        <div>
            <t-space>
                <t-popup content="编辑器设置" placement="bottom" trigger="hover">
                    <t-button theme="default" variant="base" @click="visibleCenter = true">
                        <Setting1Icon />
                    </t-button>
                </t-popup>
            </t-space>

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
                    @popup-visible-change="ThemeOptionsonPopupVisibleChange"
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
        <div style="margin-left: 5px; margin-right: 5px">
            <t-popup content="代码格式化" placement="bottom" trigger="hover">
                <t-button theme="default" variant="base">
                    <RollfrontIcon />
                </t-button>
            </t-popup>
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref, getCurrentInstance, onMounted, inject, type Ref } from 'vue'
import { ChevronDownIcon, Setting1Icon, RollfrontIcon } from 'tdesign-icons-vue-next'

const LangMpLangValue = new Map<string, string>()
LangMpLangValue.set('C', 'c')
LangMpLangValue.set('C++', 'cpp')
LangMpLangValue.set('Java', 'java')
LangMpLangValue.set('Rust', 'rust')
LangMpLangValue.set('Python', 'python')
const LangValueMpLang = new Map<string, string>()
LangValueMpLang.set('c', 'C')
LangValueMpLang.set('cpp', 'C++')
LangValueMpLang.set('java', 'Java')
LangValueMpLang.set('rust', 'Rust')
LangValueMpLang.set('python', 'Python')

const ConvertLangName = (langValue: string): string => {
    return LangMpLangValue.get(langValue) ?? ''
}

const ConvertLangValue = (langValue: string): string => {
    return LangValueMpLang.get(langValue) ?? ''
}

const langOptions: string[] = ['C', 'C++', 'Rust', 'Java', 'Python']
const currentLang = ref<string>('java')
const popupVisible = ref(false)

const onLangOptionClick = (item: string) => {
    currentLang.value = ConvertLangName(item)
    emit() // 选择不同语言时, 传送当前信息给 CodeEditor 组件
    // 选中后立即关闭浮层
    popupVisible.value = false
}
const onPopupVisibleChange = (val: boolean) => {
    popupVisible.value = val
}
const visibleCenter = ref(false)

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

/* 设置当前 Tab 所占空格数 */
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
const ThemeOptionsonPopupVisibleChange = (val: boolean) => {
    ThemeOptionsVisible.value = val
}

/* 弹出的 monacoEditor 设置对话框的确实和取消 */
const configConfirm = () => {
    // 确认
    visibleCenter.value = false
    emit() // 发送给 CodeEditor 组件相关设置信息
}
const configNo = () => {
    // 取消
    visibleCenter.value = false
}

/* 将 Editor Config 传给 MonacoCodeEditor 组件 */
const currentComponentInstance = getCurrentInstance()
const emit = () => {
    currentComponentInstance?.proxy?.$Bus.emit('on-editor-config', [
        currentLang,
        currentFontSize,
        currentTabSize,
        currentEditorTheme
    ])
}

/* 初始时加载 Local Store 中的数据 ———— 防止刷新后的数据丢失 */
onMounted(() => {
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
})

/* 控制左右拖拽时是否显示 Code Config ———— 接收 QuestionView 组件传来的信息 */
const isDisplayCodeConfig = inject<Ref<boolean>>('isDisplayCodeConfig')

/* 控制切换选项卡时是否显示 Code Config ———— 接收 EditorComponent 组件传来的信号 */
const props = defineProps<{ isDisplay: boolean }>()
</script>
<style scoped>
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
    height: 3.5vh;
    display: flex;
    flex-wrap: wrap;
    border-bottom: #4b4b4b;
}

.langSelect {
    width: 50px;
    margin-right: 37px;
}
</style>
