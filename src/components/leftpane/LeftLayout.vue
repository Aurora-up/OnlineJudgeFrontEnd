<template>
    <t-tabs
        :value="tabValue"
        @change="handlerTabsChange"
        :placement="placement"
        @dblclick="resize"
        :lazy="true"
    >
        <t-tab-panel value="description">
            <template #label>
                <t-icon name="book" class="tabs-icon-margin" />
                {{ problemDescription }}
            </template>
            <!--  题目信息组件   -->
            <QuestionDetails></QuestionDetails>
        </t-tab-panel>
        <t-tab-panel value="solution">
            <template #label>
                <t-icon name="book-open" class="tabs-icon-margin" />
                {{ problemSolution }}
            </template>
            <p style="padding: 25px">题解</p>
        </t-tab-panel>
        <t-tab-panel value="submission">
            <template #label>
                <t-icon name="history" class="tabs-icon-margin" />
                {{ problemSubmission }}
            </template>
            <SubmitRecord></SubmitRecord>
        </t-tab-panel>
        <t-tab-panel value="note">
            <template #label>
                <t-icon name="sticky-note" class="tabs-icon-margin" />
                {{ problemNote }}
            </template>
            <!--  笔记组件  -->
            <NoteComponent></NoteComponent>
        </t-tab-panel>
    </t-tabs>
</template>
<script setup lang="ts">
import { ref, inject, type Ref, onMounted, watch } from 'vue'
import NoteComponent from '@/components/leftpane/NoteComponent.vue'
import QuestionDetails from '@/components/leftpane/ProblemDetails.vue'
import SubmitRecord from '@/components/leftpane/SubmitRecord.vue'
import { useRoute, useRouter } from 'vue-router'

/* 获取 Tabs 标题的位置 */
const placement: Ref<string> = inject<Ref<string>>('questionTabsPlacement') ?? ref('top')
const problemDescription = ref<string>('题目')
const problemSolution = ref<string>('题解')
const problemSubmission = ref<string>('提交记录')
const problemNote = ref<string>('笔记')
// 根据 Tabs 位置控制标题的显隐
watch(placement, (newPlacement) => {
    if (newPlacement == 'left') {
        problemDescription.value = ''
        problemSolution.value = ''
        problemSubmission.value = ''
        problemNote.value = ''
    } else {
        problemDescription.value = '题目'
        problemSolution.value = '题解'
        problemSubmission.value = '提交记录'
        problemNote.value = '笔记'
    }
})
/*----------------------------------------------------------------------------------------*/

/* 控制 切换选项卡后的路由变化 和 切换路由后的选项卡变化 */
const PId = inject<number>('PId')
const router = useRouter()
const route = useRoute()
// 左侧 LeftPane 中默认显示 题目描述 所在的选项卡
const tabValue = ref('description')
onMounted(() => {
    // 刷新页面后根据路由切换至对应的选项卡
    tabValue.value = route.path.split('/')[2]
})
/* 跳转至对应路由 */
const toTab = (routerName: string) => {
    router.replace({
        name: routerName,
        params: {
            PId: PId
        }
    })
}
/**
 * 根据选项卡的切换修改对应的路由
 * @param newValue 选项卡值
 */
const handlerTabsChange = (newValue: string) => {
    tabValue.value = newValue
    switch (newValue) {
        case 'solution':
            toTab('ProblemSolution')
            break
        case 'submission':
            toTab('ProblemSubmission')
            break
        case 'note':
            toTab('ProblemNote')
            break
        default:
            toTab('ProblemDescription')
    }
}
/*----------------------------------------------------------------------------------------*/

/* 是否重设尺寸 (用于双击某个 Tab 来将该 Tab 尺寸扩至限制的最大或恢复初始布局) */
const isResize = ref<boolean>(false)
const emit = defineEmits(['on-l-dblclick'])
const resize = () => {
    isResize.value = !isResize.value
    emit('on-l-dblclick', isResize)
}

</script>
<style>
.tabs-icon-margin {
    margin-right: 4px;
}

.t-tabs__nav-item {
    height: 35px !important;
}
.t-tabs__nav-item-text-wrapper {
    height: 35px !important;
}
</style>
<!--
.t-tabs__nav {
   background-color: #FAFAFA !important;
}
-->
