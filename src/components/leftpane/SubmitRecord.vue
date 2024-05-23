<template>
    <div class="submitRecord">
        <div v-show="!userInfoStore.$state.isLogin" class="noLogin">
            <span style="color: #c4c4c6; font-size: 15px; ">请先登录才可查看提交记录</span>
            <t-divider layout="vertical" />
            <t-tooltip content="去登录">
                <t-button theme="primary" @click="toLogin('Login')">
                    登录
                </t-button>
            </t-tooltip>
        </div>

        <div v-show="isHaveSubmission" class="noLogin">
            <span style="color: #c4c4c6; font-size: 15px; ">暂无提交记录</span>
        </div>

        <t-collapse @dblclick="stopPropagationEvent" v-show="userInfoStore.$state.isLogin" expandIconPlacement="right" borderless>
            <t-collapse-panel
                :key="index"
                v-for="(item, index) in submissions"
            >
                <template #header>
                    <TimeIcon class="__timeIcon" style="color: #7A7A7A" /> <span style="color: #7A7A7A">{{item.judgeResult?.submitTime}}</span>
                </template>
                <template #headerRightContent>
                    <t-space size="small">
                        <t-tag
                            :theme="getStatus(item.judgeResult?.resultStatus ?? 1000)"
                            variant="light"
                            size="medium"
                        >
                            {{ getDesc(item.judgeResult?.resultStatus ?? 1000) }}
                        </t-tag>
                    </t-space>
                </template>
                <div style="overflow: auto" class="submit-code-contain">
                    <t-space>
                        通过了: {{ item.judgeResult?.passTestCasesNumber == null ? 0 : item.judgeResult?.passTestCasesNumber }}/{{
                            item.testCasesNumber
                        }}
                        个数据
                        <t-divider layout="vertical" />
                        运行总时间: {{ tackleTime(Number(item.judgeResult?.time)) }}
                        <t-divider layout="vertical" />
                        峰值内存占用: {{ tackleMemory(Number(item.judgeResult?.memory)) }}
                        <t-tooltip content="代码复制至编辑器">
                            <t-button
                                shape="circle"
                                variant="outline"
                                class="submitCodeToEditor"
                                @click="copyCodeToEditor(item.lang ?? '', item.code ?? '')"
                            >
                                <ChevronRightDoubleIcon slot="icon" class="copyIcon" />
                            </t-button>
                        </t-tooltip>
                    </t-space>
                    <!--          <n-code :code="item.code" show-line-numbers  />-->
                    <MdPreview
                        previewTheme="github"
                        editorId="preview-only"
                        :modelValue="prefix + item.lang + '\n' + getCode(item.code ?? '') + postfix"
                    />
                </div>
            </t-collapse-panel>
        </t-collapse>
    </div>
</template>

<script setup lang="ts">
import { computed, getCurrentInstance, inject, onMounted, ref, toRef } from 'vue'
import { MdPreview } from 'md-editor-v3'
import {
    ProblemSubmitControllerService,
    type ProblemSubmitRecordQueryResponse
} from '../../../apis'
import { UserInfoStore } from '@/stores/user-info'
import { MessagePlugin } from 'tdesign-vue-next'
import { useRouter } from 'vue-router'
import { ChevronRightDoubleIcon, TimeIcon } from 'tdesign-icons-vue-next'
import { base64ToUtf8, tackleMemory, tackleTime } from '@/utils/data-tackle'
import { Base64 } from 'js-base64';

const PId = inject<number>('PId')
const PID = ref<number>(0)
const userInfoStore = UserInfoStore()
const submissions = ref<Array<ProblemSubmitRecordQueryResponse>>()
const isHaveSubmission = ref<boolean>(false)


const mp = new Map<number, string>()
mp.set(1000, '')

const prefix = '```'
const postfix = '\n```'

const getStatus = (status: number) => {
    if (status === 1000) {
        return 'success'
    } else if (status === 1003 || status === 1004 || status === 1006) {
        return 'warning'
    } else {
        return 'danger'
    }
}
const getDesc = (status: number) => {
    switch (status) {
        case 1:
            return 'Permission Deny'
        case 500:
            return 'Judge System Error'
        case 1000:
            return 'Accepted'
        case 1001:
            return 'Compile Error'
        case 1002:
            return 'Runtime Error'
        case 1003:
            return 'Time Limit Exceeded'
        case 1004:
            return 'Memory Limit Exceeded'
        case 1005:
            return 'Wrong Answer'
        case 1006:
            return 'Presentation Error'
    }
}
const getCode = (code: string) => {
    return Base64.decode(code) // Base64 解码
}

const router = useRouter()
const toLogin = (routerName: string) => {
    router.replace({
        name: routerName
    })
}

onMounted(async () => {
    PID.value = PId ?? 0
    if (!userInfoStore.$state.isLogin) {
        await userInfoStore.getLoginUserInfo()
    }
    await ProblemSubmitControllerService.getProblemSubmissionByPIdAndUId(
        PID.value,
        userInfoStore.$state.loginUserInfo.userId
    )
    .then((res) => {
        if (res.statusCode === 0) {
            submissions.value = res.data
        } else if (res.statusCode == 40004) {
            isHaveSubmission.value = true
            MessagePlugin.warning({
                content: '暂无提交记录'
            })
        } else {
            MessagePlugin.warning({
                content: res.description
            })
        }
    })
    .catch((e) => {
        MessagePlugin.error({
            content: e?.message
        })
    })

})


const currentComponentInstance = getCurrentInstance()
const copyCodeToEditor = (lang: string, code: string) => {
    currentComponentInstance?.proxy?.$Bus.emit('copy-code-to-editor', [lang,code])
}

const stopPropagationEvent = (event: Event) => {
    event.stopPropagation()
}
</script>

<style>
.t-collapse-panel__wrapper{
    transition: background-color 0.3s ease !important;
}
.t-collapse-panel__wrapper:hover {
    /* 使用渐变效果创建更吸引人的过渡 */
    background: #E8E8E8 !important;
    cursor: pointer !important;
}
.submit-code-contain {
    background-color: #ffffff;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
}

.submitRecord {
    overflow: auto;
    height: 90vh;
}
.submitRecord::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px rgb(193, 193, 193);
    background-color: #f5f5f5;
    border-radius: 10px;
}
.submitRecord::-webkit-scrollbar {
    width: 6px;
    background-color: #f5f5f5;
    border-radius: 10px;
}
.submitRecord::-webkit-scrollbar-thumb {
    background-color: #C1C1C1;
    border-radius: 10px;
}
.noLogin {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 90vh;
}
.__timeIcon {
    margin-right: 3px;
    color: #7A7A7A
}
.submitCodeToEditor {
    margin-right: 10px;
}
</style>
