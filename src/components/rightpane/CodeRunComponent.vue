<template>
    <t-tabs :value="TabValue" :placement="placement" @change="handlerChange" @dblclick="resize">
        <t-tab-panel value="first">
            <template #label>
                <t-icon name="assignment-checked" class="tabs-icon-margin" />
                {{ codeTest }}
            </template>
            <div class="runTab" @dblclick="stopPropagationEvent">
                <TestCase v-if="TabValue == 'first'"></TestCase>
            </div>
        </t-tab-panel>
        <t-tab-panel value="second">
            <template #label>
                <t-icon name="terminal" class="tabs-icon-margin" />
                {{ codeTestResult }}
            </template>
            <div class="runTab" @dblclick="stopPropagationEvent">
                <TestCaseResult v-if="TabValue == 'second'" :isDebugging="isDebugging"></TestCaseResult>
            </div>
        </t-tab-panel>
        <t-tab-panel value="third">
            <template #label>
                <CalendarIcon class="tabs-icon-margin" />
                {{ codeResult }}
            </template>
            <div class="runTab" @dblclick="stopPropagationEvent">
                <JudgeResult v-if="TabValue == 'third'" :isJudging="isJudging"></JudgeResult>
            </div>
        </t-tab-panel>
    </t-tabs>
</template>
<script setup lang="ts">
import { ref, inject, type Ref, watch, getCurrentInstance } from 'vue'
import { CalendarIcon } from 'tdesign-icons-vue-next'
import TestCase from '@/components/rightpane/TestCase.vue'
import TestCaseResult from '@/components/rightpane/TestCaseResult.vue'
import JudgeResult from '@/components/rightpane/JudgeResult.vue'
const currentComponentInstance = getCurrentInstance()

const CodeResultHeightVH = inject<Ref<string>>('CodeResultHeightVH')
const codeResultHeightVH = ref(CodeResultHeightVH)


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
const isDebugging = ref(false);
const isJudging = ref(false)

currentComponentInstance?.proxy?.$Bus.on('debug-tabs', (tabValue) => {
    if (Number(tabValue) == 2) {
        TabValue.value = 'second'
        isDebugging.value = true
    } else if (Number(tabValue) == 3) {
        TabValue.value = 'third'
        isJudging.value = true
    }
})
currentComponentInstance?.proxy?.$Bus.on('debugging', (data) => {
    isDebugging.value = Boolean(data)
})

currentComponentInstance?.proxy?.$Bus.on('running', (data) => {
    isJudging.value = Boolean(data)
})

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
.runTab::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px rgb(193, 193, 193);
    background-color: #f5f5f5;
    border-radius: 10px;
}
.runTab::-webkit-scrollbar {
    width: 6px;
    background-color: #f5f5f5;
    border-radius: 10px;
}
.runTab::-webkit-scrollbar-thumb {
    background-color: #C1C1C1;
    border-radius: 10px;
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

.attachIcon {
    padding-bottom: 2px;
}
</style>
