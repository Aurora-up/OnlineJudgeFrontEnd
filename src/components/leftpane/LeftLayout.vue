<template>
  <t-tabs :value="tabValue" @change="handlerChange" :placement="placement" @dblclick="resize" :lazy="true">
    <t-tab-panel value="description">
      <template #label>
        <t-icon name="book" class="tabs-icon-margin" />
        题目
      </template>
      <!--  题目信息组件   -->
      <QuestionDetails></QuestionDetails>
    </t-tab-panel>
    <t-tab-panel value="solution">
      <template #label>
        <t-icon name="book-open" class="tabs-icon-margin" />
        题解
      </template>
      <p style="padding: 25px">题解</p>
    </t-tab-panel>
    <t-tab-panel value="submission">
      <template #label>
        <t-icon name="time" class="tabs-icon-margin" />
        提交记录
      </template>
      <SubmitRecord></SubmitRecord>
    </t-tab-panel>
    <t-tab-panel value="note">
      <template #label>
        <t-icon name="sticky-note" class="tabs-icon-margin" />
        笔记
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


const PId = inject<number>("PId")
const router = useRouter()
const route = useRoute()




/* 获取 Tabs 位置 */
const placement = inject<Ref<string>>('questionTabsPlacement')

const tabValue = ref('description')

onMounted(() => {
  tabValue.value = route.path.split("/")[2]
})

const toTab = (routerName: string) => {
  router.replace({
    name: routerName,
    params: {
      PId: PId
    }
  });
}

const handlerChange = (newValue: string) => {
  tabValue.value = newValue
  switch (newValue) {
    case 'solution':
      toTab('ProblemSolution')
      break;
    case 'submission':
      toTab('ProblemSubmission')
      break;
    case 'note':
      toTab('ProblemNote')
      break;
    default:
      toTab('ProblemDescription')
  }
}

/* 是否重设尺寸 (用于双击某个 Tab 来将该 Tab 尺寸扩至限制的最大或恢复初始布局) */
const isResize = ref<boolean>(false)
const emit = defineEmits(['on-l-dblclick'])
const resize = (e) => {
  isResize.value = !isResize.value
  emit('on-l-dblclick', isResize)
  // console.log(isResize.value)
}


</script>
<style scoped>
.tabs-icon-margin {
  margin-right: 4px;
}
</style>
