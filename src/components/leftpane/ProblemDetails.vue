<template>
    <div class="qDetails" @dblclick="stopPropagationEvent">
        <div class="problemHeader">
            <h1 style="font-size: 27px">{{ PId }}. {{ problemData?.title }}</h1>
            <div style="flex: 1"></div>
            <div class="tackleProblemSelect">
                <div style="margin-left: 5px; margin-right: 5px">
                    <t-tooltip content="题库">
                        <t-button
                            theme="default"
                            variant="outline"
                            style="color: #7a7a7a"
                            @click="visible = true"
                        >
                            <ListIcon style="padding-top: 1px; padding-right: 1px" />
                        </t-button>
                    </t-tooltip>
                </div>
                <div style="margin-left: 5px; margin-right: 5px">
                    <t-tooltip content="上一题">
                        <t-button
                            theme="default"
                            variant="outline"
                            style="color: #7a7a7a"
                            :disabled="leftMove"
                            @click="tackleLeftMove"
                        >
                            <ArrowLeftIcon />
                        </t-button>
                    </t-tooltip>
                </div>
                <div style="margin-left: 5px; margin-right: 5px">
                    <t-tooltip content="下一题">
                        <t-button
                            theme="default"
                            variant="outline"
                            style="color: #7a7a7a"
                            :disabled="rightMove"
                            @click="tackleRightMove"
                        >
                            <ArrowRightIcon />
                        </t-button>
                    </t-tooltip>
                </div>
            </div>
        </div>
        <div style="margin-left: 20px">
            <t-space break-line size="3">
                <t-tag variant="light" size="medium" shape="round" class="difficultTag"
                    >{{ difficultTag }}
                </t-tag>
                <t-divider layout="vertical" />
                <span class="noImportantInfo"
                    ><TimeIcon class="noImportantIcon" />时间限制:
                    {{ problemData?.timeLimit }}ms</span
                >
                <t-divider layout="vertical" />
                <span class="noImportantInfo"
                    ><CpuIcon class="noImportantIcon" />空间限制: {{ memoryLimit }}M</span
                >
                <t-divider layout="vertical" />
                <span class="noImportantInfo"
                    ><CheckCircleIcon class="noImportantIcon" />通过率: {{ passRate }}%</span
                >
            </t-space>
        </div>
        <div>
            <MdPreview
                previewTheme="vuepress"
                editorId="preview-only"
                :modelValue="problemData?.content"
            />
        </div>
        <t-space direction="vertical" style="width: 100%">
            <t-collapse
                :expand-icon="showArrow"
                :disabled="disabled"
                borderless
                @change="handlePanelChange"
                expandIconPlacement="right"
            >
                <t-collapse-panel value="1">
                    <template #header>
                        <TagIcon style="color: #7a7a7a; padding-right: 3px" size="15px" />
                        <span class="noImportantInfo">算法标签</span></template
                    >
                    <template #default>
                        <t-space
                            :key="index"
                            v-for="(item, index) in problemData?.tags"
                            style="margin-right: 5px"
                        >
                            <t-tag
                                style="color: #7f7f7f"
                                variant="light"
                                size="medium"
                                shape="round"
                                >{{ item }}
                            </t-tag>
                        </t-space>
                    </template>
                </t-collapse-panel>
                <t-collapse-panel value="2">
                    <template #header
                        ><span class="noImportantInfo">
                            <User1Icon style="color: #7a7a7a" size="15px" />
                            题目来源</span
                        ></template
                    >
                    <template #default>
                        <t-space
                            :key="index"
                            v-for="(item, index) in problemData?.source"
                            style="margin-right: 5px"
                        >
                            <t-tag
                                style="color: #7f7f7f"
                                variant="light"
                                size="medium"
                                shape="round"
                                >{{ item }}
                            </t-tag>
                        </t-space>
                    </template>
                </t-collapse-panel>
            </t-collapse>
        </t-space>

        <t-drawer
            v-model:visible="visible"
            header="Aurora OJ 题库"
            :on-overlay-click="() => (visible = false)"
            placement="left"
            @cancel="visible = false"
            size="medium"
        >
            <template #footer></template>
            <SimpleProblemRepository></SimpleProblemRepository>
        </t-drawer>
        <FooterComponent></FooterComponent>
    </div>
</template>

<script setup lang="ts">
import { computed, getCurrentInstance, inject, onBeforeMount, onMounted, ref, watch } from 'vue'
import { MdPreview } from 'md-editor-v3'
import 'md-editor-v3/lib/preview.css'
import {
    ArrowLeftIcon,
    ArrowRightIcon,
    CheckCircleIcon,
    CpuIcon,
    ListIcon,
    TagIcon,
    TimeIcon,
    User1Icon
} from 'tdesign-icons-vue-next'
import SimpleProblemRepository from '@/components/leftpane/SimpleProblemRepository.vue'
import { useRouter } from 'vue-router'
import FooterComponent from '@/components/FooterComponent.vue'
import { ProblemControllerService, type ProblemQueryResponse } from '../../../apis'
import { MessagePlugin } from 'tdesign-vue-next'


const router = useRouter()
const currentComponentInstance = getCurrentInstance()
const PId = inject<number>('PId')

onBeforeMount(async () => {
    await ProblemControllerService.getProblemById(Number(PId))
        .then((res:any) => {
            if (res.statusCode == 0) {
                PID.value = res.data?.problemId
                problemData.value = res.data
                // 测试用例传送至运行组件
                currentComponentInstance?.proxy?.$Bus.emit(
                    'problem-test-sample',
                    problemData.value?.testSample ?? []
                )
                // currentComponentInstance?.proxy?.$Bus.emit('problem-details-loading', 0)
            } else {
                MessagePlugin.warning({
                    content: '题目请求出错'
                })
            }
        })
        .catch((err:any) => {
            MessagePlugin.error({
                content: err.message
            })
        })
})

onMounted(async () => {
    PID.value = PId ?? 1
    const total = localStorage.getItem('problem-total')
    if (total != null) {
        problemTotal.value = Number(total)
    }
})

const PID = ref<number>()
/* 题目相关数据 */
const problemData = ref<ProblemQueryResponse>()
/* 难易程度标签 */
const difficultColor = computed(() => {
    switch (problemData.value?.difficult) {
        case 0:
            return '#2ba471'
        case 1:
            return '#FFB800'
        case 2:
            return '#FF2C55'
        default:
            return '#2ba471'
    }
})
const difficultTag = computed(() => {
    switch (problemData.value?.difficult) {
        case 0:
            return '简单'
        case 1:
            return '中等'
        case 2:
            return '困难'
        default:
            return '简单'
    }
})
/* 通过率 */
const passRate = computed(() => {
    if (problemData.value?.submitNum == 0) {
        return 0
    } else {
        return (
            ((problemData.value?.acceptedNum ?? 0) / (problemData.value?.submitNum ?? 100)) *
            100
        ).toFixed(2)
    }
})
/* 内存限制 */
const memoryLimit = computed(() => {
    return (problemData.value?.memoryLimit ?? 0) / 1024 / 1024
})

/* 算法标签、来源--多级列表展示控制相关 */
const visible = ref(false)
const disabled = ref(false)
const showArrow = ref(true)
const handlePanelChange = (val: any) => {
    // console.log('panel', val)
}

/* 处理上一题和下一题控件相关 */
const problemTotal = ref<number>(0)
currentComponentInstance?.proxy?.$Bus.on('problem-total', (total: any) => {
    problemTotal.value = Number(total)
})
const leftMove = ref<boolean>(false)
const rightMove = ref<boolean>(false)
watch(PID, (n) => {
    if (n == 1) {
        leftMove.value = true
    } else if (n == problemTotal.value) {
        rightMove.value = true
    }
})
const tackleLeftMove = () => {
    router
        .push({
            name: 'ProblemDescription',
            params: {
                PId: Number(PID.value) - 1
            }
        })
        .then(() => {
            router.go(0)
        })
}
const tackleRightMove = () => {
    router
        .push({
            name: 'ProblemDescription',
            params: {
                PId: Number(PID.value) + 1
            }
        })
        .then(() => {
            router.go(0)
        })
}

/* 防止双击冒泡 */
const stopPropagationEvent = (event: any) => {
    event.stopPropagation()
}
</script>

<style scoped>
.tackleProblemSelect {
    padding-top: 5px;
    display: flex;
    padding-bottom: 10px;
    flex-wrap: wrap;
}

.problemHeader {
    margin-left: 20px;
    display: flex;
    flex-wrap: wrap;
}

.qDetails {
    overflow: auto;
    height: 90vh;
}
.qDetails::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px rgb(193, 193, 193);
    background-color: #f5f5f5;
    border-radius: 10px;
}
.qDetails::-webkit-scrollbar {
    width: 6px;
    background-color: #f5f5f5;
    border-radius: 10px;
}
.qDetails::-webkit-scrollbar-thumb {
    background-color: #C1C1C1;
    border-radius: 10px;
}

.noImportantInfo {
    color: #7a7a7a;
    font-size: 13px;
}

.noImportantIcon {
    padding-bottom: 2px;
    padding-right: 2px;
}

.difficultTag {
    color: v-bind(difficultColor);
    font-size: 13px;
}
</style>
