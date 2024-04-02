<template>
    <t-tabs :value="TabValue" :placement="placement" @change="handlerChange" @dblclick="resize">
        <t-tab-panel value="first">
            <template #label>
                <t-icon name="assignment-checked" class="tabs-icon-margin" />
                {{ codeTest }}
            </template>
            <div class="runTab" @dblclick="stopPropagationEvent">
                <TestCase></TestCase>
            </div>
        </t-tab-panel>
        <t-tab-panel value="second">
            <template #label>
                <t-icon name="terminal" class="tabs-icon-margin" />
                {{ codeTestResult }}
            </template>
            <div class="runTab" @dblclick="stopPropagationEvent">
                <TestCaseResult></TestCaseResult>
            </div>
        </t-tab-panel>
        <t-tab-panel value="three">
            <template #label>
                <CalendarIcon class="tabs-icon-margin" />
                {{ codeResult }}
            </template>
            <div @dblclick="stopPropagationEvent" class="resultContainer">
                <div class="resultHeader">
                    <h2 class="resultTitle">Accept</h2>
                    <div class="resultAttachInfo"><TimeIcon class="attachIcon" /> 运行时间: {{runTime}} ms</div>
                    <div class="resultAttachInfo"><CpuIcon class="attachIcon" /> 占用内存: {{runMemory}} K</div>
                </div>
                <div class="resultContent">
                    <MdPreview
                        previewTheme="github"
                        editorId="preview-only"
                        :modelValue="resultContent"
                    />
                </div>
            </div>

        </t-tab-panel>
    </t-tabs>
</template>
<script setup lang="ts">
import { ref, inject, type Ref, watch } from 'vue'
import { CalendarIcon, CpuIcon, TerminalIcon, TimeIcon } from 'tdesign-icons-vue-next'
import { MdPreview } from 'md-editor-v3'
import TestCase from '@/components/rightpane/TestCase.vue'
import TestCaseResult from '@/components/rightpane/TestCaseResult.vue'

const CodeResultHeightVH = inject<Ref<string>>('CodeResultHeightVH')
const codeResultHeightVH = ref(CodeResultHeightVH)

const runTime = ref<number>(35)
const runMemory = ref<number>(32756)
const runInfo = ref<string>('测试提交结果输出');
const resultContent = ref<string>(`\`\`\`
${runInfo.value}
\`\`\``)



/* 获取 Tabs 位置 */
const placement: Ref<string> = inject<Ref<string>>('TestRunTabsPlacement') ?? ref('top')
const codeTest = ref<string>('测试用例')
const codeTestResult = ref<string>('测试结果')
const codeResult = ref<string>('提交结果')
watch(placement, (newPlacement) => {
    if (newPlacement == 'right') {
        codeTest.value = ''
        codeResult.value = ''
        codeTestResult.value = ''
    } else {
        codeTest.value = '测试用例'
        codeTestResult.value = '测试结果'
        codeResult.value = '提交结果'
    }
})

const TabValue = ref('first')


const handlerChange = (newValue: string) => {
    TabValue.value = newValue
}

// 是否重设尺寸 (用于双击某个 Tab 来将该 Tab 尺寸扩至限制的最大)
const isResize = ref<boolean>(false)
const emit = defineEmits(['on-r-dblclick'])
const resize = () => {
    isResize.value = !isResize.value
    emit('on-r-dblclick', isResize)
}

const stopPropagationEvent = (event: Event) => {
    event.stopPropagation()
}
</script>
<style lang="less" scoped>
.tabs-icon-margin {
    margin-right: 4px;
}

.icon-margin {
    margin-top: 3px;
    margin-right: 4px;
}

.runTab {
    display: flex;
    flex-wrap: wrap;
    overflow: auto;
    height: v-bind(codeResultHeightVH);
    padding-left: 25px;
    padding-right: 25px;
    padding-top: 20px;
}

.submitPane {
    overflow: auto;
    margin: 10px;
    min-width: 55%;
}

.tdesign-demo-block {
    margin-top: 40px;
    margin-left: 10px;
    display: flex;
    justify-content: space-around;
    min-width: 40%;
}

.resultContainer {
    padding-left: 15px;
    padding-bottom: 2px;
    padding-right: 15px;
    overflow: auto;
    height: v-bind(codeResultHeightVH);
}
.resultHeader {
    display: flex;
    flex-wrap: wrap;
}
.resultTitle {
    padding-left: 23px;
    color: #2fb55d;
    font-size: 24px;
}
.resultAttachInfo {
    padding-left: 20px;
    padding-top: 25px;
    color: #8A8A8E;
}
.attachIcon {
    padding-bottom: 2px;
}
</style>
