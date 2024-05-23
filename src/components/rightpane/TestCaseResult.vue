<template>
    <div
        v-show="!isRunOver && !isRunning"
        style="
            overflow: auto;
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
        "
    >
        <span style="color: #c4c4c6; font-size: 15px">请先执行代码</span>
    </div>
    <div
        v-show="isRunOver && isRunning"
        style="
            overflow: auto;
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
        "
    >
            <t-loading text="代码执行中..." size="small"></t-loading>
    </div>
    <n-tabs
        :value="currentCaseIndex"
        type="card"
        tab-style="min-width: 80px;"
        class="tabsContent"
        @before-leave="updateBefore"
        v-show="isRunOver && !isRunning"
    >
        <n-tab-pane v-for="panel in existPanels" :key="panel" :name="panel">
            <template #default>
                <div class="resultBox">
                    <div class="resultHeader">
                        <t-tooltip content="点击查看提醒">
                            <t-button shape="circle" variant="text" size="small">
                                <HelpCircleIcon size="15" @click="visible = true"/>
                            </t-button>
                        </t-tooltip>
                        <t-dialog
                            v-model:visible="visible"
                            theme="warning"
                            header="注意"
                            body="该执行结果不会与该题目的正确结果进行比对，这里【通过】仅指代码运行时没有出错，与题目无关"
                            :cancel-btn="null"
                            @confirm="visible = false"
                        />
                        <span
                            class="successResult"
                            v-show="getStatusByIndex(Number(panel.split(' ')[1])).isPass == 0"
                        >
                            {{ getStatusByIndex(Number(panel.split(' ')[1])).msg }}
                        </span>
                        <span
                            class="failResult"
                            v-show="getStatusByIndex(Number(panel.split(' ')[1])).isPass == 1"
                        >
                            {{ getStatusByIndex(Number(panel.split(' ')[1])).msg }}
                        </span>
                        <div class="resultAttachInfo">
                            <TimeIcon class="attachIcon" />
                            运行时间: {{ tackleTime(getTimeByIndex(Number(panel.split(' ')[1]))) }}
                        </div>
                        <div class="resultAttachInfo">
                            <CpuIcon class="attachIcon" />
                            占用内存: {{ tackleMemory(getMemByIndex(Number(panel.split(' ')[1]))) }}
                        </div>
                    </div>
                    <div class="resultContent">
                        <textarea
                            class="textArea"
                            style="outline: 1px solid #f2f2f4"
                            :style="{
                                outline:
                                    '1px solid ' +
                                    (getStatusByIndex(Number(panel.split(' ')[1])).isPass == 0
                                        ? '#03BF80'
                                        : '#EF4643')
                            }"
                            :rows="
                                getTestCaseByIndex(Number(panel.split(' ')[1])).split('\n').length
                            "
                            readonly
                            :value="getTestCaseByIndex(Number(panel.split(' ')[1]))"
                        >
                        </textarea>
                        <t-tooltip :content="`${isCopySuccess == true ? '已复制' : '复制'}`">
                            <t-button
                                shape="rectangle"
                                class="copyIcon"
                                theme="default"
                                @click="
                                    copyOperation(getTestCaseByIndex(Number(panel.split(' ')[1])))
                                "
                            >
                                <CopyIcon size="17px" v-show="!isCopySuccess" />
                                <CheckCircleIcon style="color: #03bf80" v-show="isCopySuccess" />
                            </t-button>
                        </t-tooltip>
                    </div>
                </div>
            </template>
        </n-tab-pane>
    </n-tabs>
</template>

<script setup lang="ts">
import { getCurrentInstance, onMounted, ref, watch } from 'vue'
import {
    CheckCircleIcon,
    CopyIcon,
    CpuIcon,
    HelpCircleIcon,
    TimeIcon
} from 'tdesign-icons-vue-next'
import { useRoute } from 'vue-router'
import { base64ToUtf8, tackleMemory, tackleTime } from '../../utils/data-tackle'
import { Base64 } from 'js-base64'

const visible = ref<boolean>(false);

type statusMsg = {
    msg: string,
    isPass: number
}

const currentComponentInstance = getCurrentInstance()
const route = useRoute()
const PId = route.params.PId

const currentCaseIndex = ref<string>('Case 1')
const indexList = ['Case 1', 'Case 2', 'Case 3', 'Case 4', 'Case 5']
const existPanels = ref<string[]>([''])
const resultMessages = ref<string[]>([])
const useTimeList = ref<number[]>([])
const useMemoryList = ref<number[]>([])
const debugResultStatus = ref<statusMsg[]>([])
const currentLoginUid = ref<number>(0)

const isRunOver = ref<boolean>(false)
watch(resultMessages, (n) => {
    isRunOver.value = n.length != 0
})

currentComponentInstance?.proxy?.$Bus.on('debug-code', (data) => {
    currentLoginUid.value = Number(localStorage.getItem('current-login-uid'))
    tackleDebugResult(data)
    localStorage.setItem(`debug-res-${PId}-${currentLoginUid.value}`, JSON.stringify(data))
    isRunning.value = false
    currentComponentInstance?.proxy?.$Bus.emit('debugging', false)
})

const props = defineProps<{
    isDebugging: boolean
}>()
const isRunning = ref<boolean>(props.isDebugging);

currentComponentInstance?.proxy?.$Bus.on('debug-tabs', (tabValue) => {
    if (Number(tabValue) == 2) {
        isRunning.value = true
    }
})


const tackleDebugResult = (data: any) => {
    console.log(data)
    const testCasesNum = data.length
    existPanels.value = []
    for (let i = 0; i < testCasesNum; i++) {
        existPanels.value.push(indexList[i])
    }
    resultMessages.value = data.map((e: any) => Base64.decode(e.resultMessage))
    useTimeList.value = data.map((e: any) => e.time)
    useMemoryList.value = data.map((e: any) => e.memory)
    debugResultStatus.value = data.map((e: any) => {
        const status = e.resultStatus
        switch (status) {
            case 1000:
                return {
                    msg: '通过',
                    isPass: 0
                }
            case 1001:
                return {
                    msg: '未通过 - Compiler Error',
                    isPass: 1
                }
            case 1002:
                return {
                    msg: '未通过 - Runtime Error',
                    isPass: 1
                }
            case 1003:
                return {
                    msg: '未通过 - Time Limit Exceeded',
                    isPass: 1
                }
            case 1004:
                return {
                    msg: '未通过 - Memory Limit Exceeded',
                    isPass: 1
                }
            case 1:
                return {
                    msg: '未通过 - Permission Deny',
                    isPass: 1
                }
            case 777:
                return {
                    msg: '未通过 - Judge System Error',
                    isPass: 1
                }
        }
    })
}

onMounted(() => {
    currentLoginUid.value = Number(localStorage.getItem('current-login-uid'))
    const data = JSON.parse(
        <string>localStorage.getItem(`debug-res-${PId}-${currentLoginUid.value}`)
    )
    if (data !== null && data.length !== 0) {
        tackleDebugResult(data)
    }
})

const getTestCaseByIndex = (index: number) => {
    return resultMessages.value[index - 1]
}
const getTimeByIndex = (index: number) => {
    if (useTimeList.value[index - 1] == null) {
        return NaN;
    }
    return useTimeList.value[index - 1]
}
const getMemByIndex = (index: number) => {
    if (useMemoryList.value[index - 1] == null) {
        return NaN;
    }
    return useMemoryList.value[index - 1]
}
const getStatusByIndex = (index: number) => {
    return debugResultStatus.value[index - 1]
}

function updateBefore(name: string) {
    currentCaseIndex.value = name
}

/* 粘贴操作 */
const isCopySuccess = ref<boolean>(false)
const copyOperation = (value: string) => {
    navigator.clipboard.writeText(value).then(function () {
        isCopySuccess.value = true
    })
    setTimeout(() => {
        isCopySuccess.value = false
    }, 3000)
}
</script>

<style scoped>
.textArea {
    height: auto; /* 高度自动调整 */
    resize: none;
    padding: 12px 20px;
    background-color: #f2f2f4;
    border: none;
    border-radius: 7px;
    width: 95%;
    font-size: 14px;
}

.copyIcon {
    margin-left: 1px;
    margin-top: 5px;
    z-index: 100;
    font-size: smaller;
    overflow: hidden;
    height: 30px;
    width: 30px;
    text-align: center;
    border-radius: 6px;
    background-color: #ffffff;
}

.resultHeader {
    display: flex;
    flex-wrap: wrap;
    padding-left: 3px;
    margin-bottom: 5px;
}

.resultAttachInfo {
    padding-left: 20px;
    color: #8a8a8e;
}

.attachIcon {
    padding-bottom: 2px;
}

.successIcon {
    color: #03bf80;
}

.successResult {
    padding-left: 5px;
    color: #03bf80;
    font-weight: bold;
    font-size: 16px;
}

.failIcon {
    color: #ef4643;
}

.failResult {
    padding-left: 5px;
    color: #ef4643;
    font-weight: bold;
    font-size: 16px;
}

.resultContent {
    display: flex;
    width: 94%;
}
</style>
