<template>
        <n-tabs
            :value="currentCaseIndex"
            type="card"
            tab-style="min-width: 80px;"
            class="tabsContent"
            @before-leave="updateBefore"
        >
            <n-tab-pane v-for="panel in existPanels" :key="panel" :name="panel">
                <template #default>
                    <div class="resultBox">
                        <div class="resultHeader">
                            <CheckIcon size="22px" class="successIcon"/>
                            <span class="resultTest"> 通过 </span>
                            <div class="resultAttachInfo">
                                <TimeIcon class="attachIcon" />
                                运行时间: {{}} ms
                            </div>
                            <div class="resultAttachInfo">
                                <CpuIcon class="attachIcon" />
                                占用内存: {{}} K
                            </div>
                        </div>
                        <div class="resultContent">
                            <textarea
                                class="textArea"
                                :rows="getTestCaseByIndex(Number(panel.split(' ')[1])).split('\n').length"
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
                                        copyOperation(
                                            getTestCaseByIndex(Number(panel.split(' ')[1]))
                                        )
                                    "
                                >
                                    <CopyIcon size="17px" v-show="!isCopySuccess" />
                                    <CheckCircleIcon
                                        style="color: #03BF80"
                                        v-show="isCopySuccess"
                                    />
                                </t-button>
                            </t-tooltip>
                        </div>
                    </div>
                </template>
            </n-tab-pane>
        </n-tabs>
</template>

<script setup lang="ts">
import {ref} from 'vue'
import { CheckCircleIcon, CheckIcon, CopyIcon, CpuIcon, TimeIcon } from 'tdesign-icons-vue-next'


const currentCaseIndex = ref<string>('Case 1')
const existPanels = ref<string[]>(['Case 1', 'Case 2'])
const testCaseValue = ref<string[]>(['3 \n3', '6'])

const getTestCaseByIndex = (index: number) => {
    return testCaseValue.value[index - 1]
}


function updateBefore(name: string) {
    currentCaseIndex.value = name
}

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
    outline: 1px solid #03BF80;
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
    color: #03BF80;
}
.resultTest {
    padding-left: 5px;
    color: #03BF80;
    font-weight: bold;
    font-size: 16px;
}
.resultContent{
    display: flex;
    width: 94%;
}
</style>
