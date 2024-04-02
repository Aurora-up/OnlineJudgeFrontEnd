<template>
    <div class="qDetails" @dblclick="stopPropagationEvent">
        <div class="problemHeader">
            <h1 style="font-size: 27px">{{ PID }}. {{ QName }}</h1>
            <div style="flex: 1"></div>
            <div class="tackleProblemSelect">
                <div style="margin-left: 5px; margin-right: 5px">
                    <t-button
                        theme="default"
                        variant="outline"
                        style="color: #7a7a7a"
                        @click="visible = true"
                    >
                        <ListIcon style="padding-top: 3px; padding-right: 2px" />
                        题目列表
                    </t-button>
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
                <t-tag variant="light" size="medium" shape="round" style="color: #2BA471; font-size: 13px">{{ Tag1 }}</t-tag>
                <t-divider layout="vertical" />
                <span class="noImportantInfo"
                    ><TimeIcon class="noImportantIcon" />时间限制: {{ 1000 }}ms</span
                >
                <t-divider layout="vertical" />
                <span class="noImportantInfo"
                    ><CpuIcon class="noImportantIcon" />空间限制: {{ 128 }}M</span
                >
                <t-divider layout="vertical" />
                <span class="noImportantInfo"
                    ><CheckCircleIcon class="noImportantIcon" />通过率: {{ 64.13 }}%</span
                >
            </t-space>
        </div>
        <div>
            <MdPreview previewTheme="github" editorId="preview-only" :modelValue="QTest" />
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
                    <template #header><span class="noImportantInfo">算法标签</span></template>
                    <template #default>
                        <t-space
                            :key="index"
                            v-for="(item, index) in Tag2"
                            style="margin-right: 5px"
                        >
                            <t-tag style="color: #7f7f7f" variant="light" size="medium" shape="round">{{ item }}</t-tag>
                        </t-space>
                    </template>
                </t-collapse-panel>
                <t-collapse-panel value="2">
                    <template #header><span class="noImportantInfo">题目来源</span></template>
                    <template #default>
                        <t-space
                            :key="index"
                            v-for="(item, index) in ProblemSource"
                            style="margin-right: 5px"
                        >
                            <t-tag  style="color: #7f7f7f" variant="light" size="medium" shape="round" >{{ item }}</t-tag>
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
            <template #footer>
            </template>
            <SimpleProblemRepository></SimpleProblemRepository>
        </t-drawer>
        <FooterComponent></FooterComponent>
    </div>
</template>

<script setup lang="ts">
import { getCurrentInstance, inject, onMounted, ref, watch } from 'vue'
import { MdPreview } from 'md-editor-v3'
import 'md-editor-v3/lib/preview.css'
import {
    ArrowLeftIcon,
    ArrowRightIcon,
    CheckCircleIcon,
    CpuIcon,
    ListIcon,
    TimeIcon
} from 'tdesign-icons-vue-next'
import SimpleProblemRepository from '@/components/leftpane/SimpleProblemRepository.vue'
import { useRouter } from 'vue-router'
import FooterComponent from '@/components/FooterComponent.vue'
const currentComponentInstance = getCurrentInstance()
const PId = inject<number>('PId')

onMounted(() => {
    PID.value = PId ?? 1
    const total = localStorage.getItem("problem-total");
    if (total != null) {
        problemTotal.value = Number(total)
    }
    // todo 这里有一处 Bug 在做题界面清空缓存后会导致 题目总数 为0
})

const PID = ref<number>(1)
const QName = ref<string>('A + B')

// 难易程度标签
const Tag1 = ref<string>('简单')
// 题目归类标签
const Tag2 = ref<string[]>(['模拟', '测试输入输出'])

const ProblemSource = ref<string[]>(['AuroraOJ', 'ACWing'])

const QTest = ref<string>(
    `------
<font size='3px' color="#7f7f7f">
输入两个正整数，求这两个整数的和是多少
</font>

------

#### 输入

<font size='3px' color="#7f7f7f">
输入两个整数 A，B， 用空格隔开
</font>

#### 输出

<font size='3px' color="#7f7f7f">
输出一个整数，表示这两个数的和
</font>

------

#### 数据范围

$0 ≤ A, B ≤ 10^8$

#### 样例输入

\`\`\`text
3 4
\`\`\`

#### 样例输出

\`\`\`text
7
\`\`\`
`
)

const stopPropagationEvent = (event: Event) => {
    event.stopPropagation()
}

const visible = ref(false)
const disabled = ref(false)
const showArrow = ref(true)
const handlePanelChange = (val: any) => {
    console.log('panel', val)
}

const problemTotal = ref<number>(0)

currentComponentInstance?.proxy?.$Bus.on('problem-total', (total: any) => {
    problemTotal.value = Number(total)
})

const leftMove = ref<boolean>(false)
const rightMove = ref<boolean>(false)

watch(PID, (n) => {
    if (n == 1) {
        leftMove.value = true
    }
    else if (n == problemTotal.value) {
        rightMove.value = true
    }
})

const router = useRouter()
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
</script>

<style scoped>
.tackleProblemSelect {
    padding-top: 10px;
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

.noImportantInfo {
    color: #7a7a7a;
    font-size: 13px;
}

.noImportantIcon {
    padding-bottom: 2px;
    padding-right: 2px;
}
</style>
