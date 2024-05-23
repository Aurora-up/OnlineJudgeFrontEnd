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
                <div style="padding-left: 3px; padding-bottom: 2px; color: #8a8a8e">Input =</div>
                <textarea
                    class="textArea"
                    :rows="
                        getTestCaseByIndex(Number(panel.split(' ')[1])).value != null
                            ? getTestCaseByIndex(Number(panel.split(' ')[1])).value.split('\n').length
                            : 1
                    "
                    @input="adjustRows($event.target as HTMLTextAreaElement)"
                    v-model="getTestCaseByIndex(Number(panel.split(' ')[1])).value"
                ></textarea>
            </template>
        </n-tab-pane>
    </n-tabs>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, type Ref, toRaw, toRef, getCurrentInstance } from 'vue'
import { useRoute } from 'vue-router'
import { UserInfoStore } from '@/stores/user-info'
import { Base64 } from 'js-base64'

const currentComponentInstance = getCurrentInstance()
const route = useRoute()
const PId = route.params.PId
const UId = ref<number>(0)
const userInfoStore = UserInfoStore()

/* Setup 阶段获取(可能是该题目的首次加载), 接收后端该题目的测试样例 */
currentComponentInstance?.proxy?.$Bus.on('problem-test-sample', (testSample: any) => {
    testCaseValue.value.concat(
        testSample.map((e:any) => {
            if (e.input != null) {
                return toRef(Base64.decode(e.input))
            }
        })
    )
})

/* 当前组件挂载阶段 */
onMounted(async () => {
    if (!userInfoStore.$state.isLogin) {
        await userInfoStore.getLoginUserInfo()
    }
    UId.value = userInfoStore.$state.loginUserInfo.userId // 获取登录用户 ID
    const testCase = localStorage.getItem(`test-case-${PId}-${UId.value}`)
    /* 若本地已有测试用例, 优先使用本地的 (因为用户可能会 【自定义】测试用例后再提交) */
    if (testCase != null) {
        const testCaseData: string[] = JSON.parse(testCase)
        const testCaseSize = testCaseData.length
        for (let i = 0; i < testCaseSize; i++) {
            existPanels.value[i] = indexList[i]
            testCaseValue.value[i] = toRef(testCaseData[i])
        }
    }
    /* 若本地没有, 从后端获取 */
    else {
        currentComponentInstance?.proxy?.$Bus.on('problem-test-sample', (testSample: any) => {
            testCaseValue.value = testSample.map((e:any) => {
                if (e.input != null) {
                    return toRef(Base64.decode(e.input))
                }
            })
        })
        let rawTestCases: string[] = []
        for (let i = 0; i < testCaseValue.value.length; i++) {
            rawTestCases.push(toRaw(testCaseValue.value[i].value))
        }
        localStorage.setItem(`test-case-${PId}-${UId.value}`, JSON.stringify(rawTestCases))
    }
})


const indexList = ['Case 1', 'Case 2', 'Case 3', 'Case 4', 'Case 5'] // 测试样例 Tab Panel 集合
const currentCaseIndex = ref<string>('Case 1')   // 当前查看的测试用例
const existPanels = ref<string[]>(['Case 1'])
const testCaseValue = ref<Ref<string>[]>([ref("")])     // 该题目所有的测试样例 (深度响应式)
const rawTestCaseValue = ref<string[]>([])       // 该题目所有的测试样例 (非响应式) 用来存至本地

/* 根据 Tab Panel 去获取测试用例 */
const getTestCaseByIndex = (index: number) => {
    return testCaseValue.value[index - 1]
}

/* 深度监视测试用例 */
watch(
    testCaseValue,
    (newTestValues: Ref<string>[]) => {
        /* 若测试用例发生改变,则重制该题目的测试结果  */
        const oldTestCases = JSON.parse(<string>localStorage.getItem(`test-case-${PId}-${UId.value}`))
        const newTestCases = Object.assign([], newTestValues).map((e:any) => e.value)
        if (!arraysEqual(oldTestCases, newTestCases)) {
            localStorage.setItem(`debug-res-${PId}-${UId.value}`, JSON.stringify([]))
        }
        /* 同步修改到本地 */
        for (let i = 0; i < newTestValues.length; i++) {
            rawTestCaseValue.value[i] = toRaw(newTestValues[i].value)
        }
        localStorage.setItem(`test-case-${PId}-${UId.value}`, JSON.stringify(rawTestCaseValue.value))
    },
    { deep: true }
)

/* 对比新旧测试用例是否相等 */
const arraysEqual = (arr1: any[], arr2: any[]): boolean => {
    if (arr1.length !== arr2.length) {
        return false
    }
    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) {
            return false
        }
    }
    return true
}

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
    localStorage.setItem(`test-case-${PId}-${UId.value}`, JSON.stringify(rawTestCaseValue.value))
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
    const index = Number(existName.split(' ')[1]) - 1
    testCaseValue.value.splice(index, 1)
    rawTestCaseValue.value.splice(index, 1)
    // 同步至本地
    localStorage.setItem(`test-case-${PId}-${UId.value}`, JSON.stringify(rawTestCaseValue.value))
    localStorage.setItem(`debug-res-${PId}-${UId.value}`, JSON.stringify([]))
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

.n-tabs-tab__label {
    color: #7A7A7A !important;
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
