<template>
    <n-tabs
        :value="currentCaseIndex"
        type="card"
        :addable="permitAddable"
        :closable="permitClosable"
        tab-style="min-width: 80px;"
        @close="handlePanelClose"
        @add="handlePanelAdd"
        class="tabsContent"
        @before-leave="updateBefore"
    >
        <n-tab-pane v-for="panel in existPanels" :key="panel" :name="panel">
            <template #default>
                <div style="padding-left: 3px; padding-bottom: 2px; color: #8A8A8E">Input = </div>
                <textarea
                    class="textArea"
                    :rows="getTestCaseByIndex(Number(panel.split(' ')[1])).value.split('\n').length"
                    @input="adjustRows($event.target as HTMLTextAreaElement)"
                    v-model="getTestCaseByIndex(Number(panel.split(' ')[1])).value"
                ></textarea>
            </template>
        </n-tab-pane>
    </n-tabs>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, type Ref, toRaw, toRef } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const PId = route.params.PId

onMounted(() => {
    const testCase = localStorage.getItem(`test-case-${PId}`) // todo 还需加 uid
    if (testCase != null) {
        const testCaseData: string[] = JSON.parse(testCase)
        const testCaseSize = testCaseData.length
        for (let i = 0; i < testCaseSize; i++) {
            existPanels.value[i] = indexList[i]
            testCaseValue.value[i] = toRef(testCaseData[i])
        }
    } else {
        let rawTestCases: string[] = []
        for (let i = 0; i < testCaseValue.value.length; i++) {
            rawTestCases.push(toRaw(testCaseValue.value[i].value))
        }
        localStorage.setItem(`test-case-${PId}`, JSON.stringify(rawTestCases)) // todo 还需加 uid
    }
})

const indexList = ['Case 1', 'Case 2', 'Case 3', 'Case 4', 'Case 5']
const currentCaseIndex = ref<string>('Case 1')
const existPanels = ref<string[]>(['Case 1'])
const testCaseValue = ref<Ref<string>[]>([ref('1 2')])
const rawTestCaseValue = ref<string[]>([])

const getTestCaseByIndex = (index: number) => {
    return testCaseValue.value[index - 1]
}

/* 将测试用的修改实时保存 */
watch(
    testCaseValue,
    (newTestValues: Ref<string>[]) => {
        for (let i = 0; i < newTestValues.length; i++) {
            rawTestCaseValue.value[i] = toRaw(newTestValues[i].value)
        }
        localStorage.setItem(`test-case-${PId}`, JSON.stringify(rawTestCaseValue.value))
    },
    { deep: true }
)

/* 处理测试用例的添加 */
function handlePanelAdd() {
    // 新加的测试用例默认取上一测试用例的值
    const index = Number(currentCaseIndex.value.split(' ')[1])
    testCaseValue.value.push(ref(testCaseValue.value[index - 1].value))
    // 增加 Tabs 的索引
    const waitAddIndex = existPanels.value.length + 1
    existPanels.value.push(indexList[waitAddIndex - 1])
    currentCaseIndex.value = existPanels.value[existPanels.value.length - 1]
    // 存至本地
    localStorage.setItem(`test-case-${PId}`, JSON.stringify(rawTestCaseValue.value)) // todo 还需加 uid
}

/* 处理查看不同的测试用例 */
function updateBefore(name: string) {
    currentCaseIndex.value = name
}
/* 处理测试用例的删除 */
function handlePanelClose(name: string) {
    /* 删除对应的 Tabs 索引 */
    const existName = existPanels.value.find((e) => e == name)
    if (existName == undefined) return
    existPanels.value.pop()
    /* 重建 Tabs 索引, 确保顺序不乱 */
    for (let i = 0; i < existPanels.value.length; i++) {
        existPanels.value[i] = indexList[i]
    }
    // 跳转至最后一个测试用例
    currentCaseIndex.value = existPanels.value[existPanels.value.length - 1]
    // 将测试用例删除
    const index = Number(existName.split(' ')[1]) - 1;
    testCaseValue.value.splice(index, 1)
    rawTestCaseValue.value.splice(index, 1);
    // 同步至本地
    localStorage.setItem(`test-case-${PId}`, JSON.stringify(rawTestCaseValue.value)) // todo 还需加 uid
}

/* 允许添加测试用例的范围 */
const permitAddable = computed(() => ({
    disabled: existPanels.value.length >= 5
}))
/* 允许删除测试用例的范围 */
const permitClosable = computed(() => existPanels.value.length > 1)


/* textarea 的行数随着 换行符 的增加而增加 */
const adjustRows = (textarea: HTMLTextAreaElement | null) => {
    if (textarea) {
        textarea.rows = textarea.value.split('\n').length
    }
}
</script>

<style>
.tabsContent {
    overflow: auto;
    padding-left: 10px;
}
.n-tabs-nav--card-type {
    border: none !important;
    outline: none !important;
}
.n-tabs-nav-scroll-content {
    height: 3vh;
    overflow: auto;
}
.n-tabs-pad {
    border: none !important;
    outline: none !important;
}
.n-tabs-tab {
    background-color: #ffffff !important;
    border-radius: 5px !important;
    border: none !important;
    font-weight: bold !important;
}
.n-tabs-tab:hover {
    background-color: #e4e6e8 !important;
}
.n-tabs-tab--active {
    background-color: #f2f2f4 !important;
    color: #0052d9 !important;
}


.textArea {
    height: auto; /* 高度自动调整 */
    resize: none;
    padding: 12px 20px;
    background-color: #f2f2f4;
    border: none;
    outline: 1px solid transparent;
    border-radius: 7px;
    width: 95%;
    font-size: 14px;
}

.textArea:focus {
    outline: 1px solid #0052d9;
}
</style>
