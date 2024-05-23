<template>
    <div
        v-show="!isJudgeOver && !isRunning"
        style="
            overflow: auto;
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
        "
    >
        <span style="color: #c4c4c6; font-size: 15px">请先提交评审</span>
    </div>
    <div
        v-show="isJudgeOver && isRunning"
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
    <div class="resultContainer" v-show="isJudgeOver && !isRunning">
        <div class="resultHeader">
            <h2 class="resultTitle">{{resultStatus}}</h2>
            <div class="resultAttachInfo">
                <TimeIcon class="attachIcon" />
                运行总时间: {{ tackleTime(Number(runTime)) }}
            </div>
            <div class="resultAttachInfo">
                <CpuIcon class="attachIcon" />
                峰值内存占用: {{ tackleMemory(Number(runMemory)) }}
            </div>
        </div>
        <div class="resultContent">
            <MdPreview
                previewTheme="github"
                editorId="preview-only"
                :modelValue="resultContent"
                v-show="isDisplayMsg"
            />
        </div>
    </div>
</template>
<script setup lang="ts">
import { CpuIcon, TimeIcon } from 'tdesign-icons-vue-next'
import { MdPreview } from 'md-editor-v3'
import { computed, getCurrentInstance, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { tackleMemory, tackleTime } from '../../utils/data-tackle'
import { Base64 } from 'js-base64'

const currentComponentInstance = getCurrentInstance()

const route = useRoute()
const PId = route.params.PId
const currentLoginUid = ref<number>(0)
const runTime = ref<number>(0)
const runMemory = ref<number>(0)
const runInfo = ref<string>('')
const resultContent = computed(() => {
    return `\`\`\`
${runInfo.value}
\`\`\``;
})
const resultStatusCode = ref<number>()
const resultStatus = ref<string>('')
const resultStatusColor = ref<string>('') // success: #03BF80 , error: #EF4643, waring: #FAB387
const isJudgeOver = ref<boolean>(true)
watch(runInfo, (n) => {
    isJudgeOver.value = n != ''
})

currentComponentInstance?.proxy?.$Bus.on('judge-code', (data) => {
    currentLoginUid.value = Number(localStorage.getItem('current-login-uid'))
    localStorage.setItem(`judge-res-${PId}-${currentLoginUid.value}`, JSON.stringify(data))
    tackleJudgeResult(data)
    isRunning.value = false
    currentComponentInstance?.proxy?.$Bus.emit('running', false)
})

currentComponentInstance?.proxy?.$Bus.on('code-change', (data) => {
    if (Number(data) == 1) {
        isJudgeOver.value = false
    }
})
const props = defineProps<{
    isJudging: boolean
}>()
const isRunning = ref<boolean>(props.isJudging);

currentComponentInstance?.proxy?.$Bus.on('debug-tabs', (tabValue) => {
    if (Number(tabValue) == 3) {
        isRunning.value = true
    }
})

onMounted(() => {
    currentLoginUid.value = Number(localStorage.getItem('current-login-uid'))
    const data = JSON.parse(<string>localStorage.getItem(`judge-res-${PId}-${currentLoginUid.value}`)) ?? null;
    if (data != null && Object.keys(data).length !== 0) {
        tackleJudgeResult(data)
        isJudgeOver.value = true
    }
    else {
        isJudgeOver.value = false
    }
})

const tackleJudgeResult = (data: any) => {
    runTime.value = data.time;
    runMemory.value = data.memory;
    runInfo.value = Base64.decode(data.resultMessage).toString()
    resultStatusCode.value = data.resultStatus
    switch (data.resultStatus) {
        case 1000:
            resultStatus.value = "Accepted";
            resultStatusColor.value = "#03BF80"
            break;
        case 1001:
            resultStatus.value = "Compiler Error";
            resultStatusColor.value = "#EF4643";
            break;
        case 1002:
            resultStatus.value = "Runtime Error";
            resultStatusColor.value = "#EF4643";
            break;
        case 1003:
            resultStatus.value = "Time Limit Exceeded";
            resultStatusColor.value = "#FAB387";
            break;
        case 1004:
            resultStatus.value = "Memory Limit Exceeded";
            resultStatusColor.value = "#FAB387";
            break;
        case 1005:
            resultStatus.value = "Wrong Answer";
            resultStatusColor.value = "#EF4643";
            break;
        case 1006:
            resultStatus.value = "Presentation Error";
            resultStatusColor.value = "#FAB387";
            break;
        case 1:
            resultStatus.value = "Permission Deny";
            resultStatusColor.value = "#FAB387";
            break;
        case 500:
            resultStatus.value = "Judge System Error";
            resultStatusColor.value = "#EF4643";
            break;
    }
}

const isDisplayMsg = ref<boolean>(true)
watch(resultStatusCode, (n) => {
    switch (n) {
        case 1000:
            isDisplayMsg.value = false
            break;
        case 1001:
            isDisplayMsg.value = true
            break;
        case 1002:
            isDisplayMsg.value = true
            break;
        case 1003:
            isDisplayMsg.value = false
            break;
        case 1004:
            isDisplayMsg.value = false
            break;
        case 1005:
            isDisplayMsg.value = true
            break;
        case 1006:
            isDisplayMsg.value = false
            break;
        case 1:
            isDisplayMsg.value = false
            break;
        case 777:
            isDisplayMsg.value = false
            break;
    }
});

</script>

<style scoped>
.resultContainer {
    padding-left: 15px;
    padding-bottom: 2px;
    padding-right: 15px;
    overflow: auto;
    height: 100%
}
.resultAttachInfo {
    padding-left: 20px;
    padding-top: 25px;
    color: #8a8a8e;
}
.resultHeader {
    display: flex;
    flex-wrap: wrap;
}
.resultTitle {
    padding-left: 23px;
    color: v-bind(resultStatusColor);
    font-size: 24px;
}
.attachIcon {
    padding-bottom: 2px;
}
</style>