<template>
  <t-tabs :value="value" @change="handlerChange" :placement="placement" @dblclick="resize" :lazy="true">
    <t-tab-panel value="first">
      <template #label>
        <t-icon name="book" class="tabs-icon-margin" />
        题目
      </template>
      <!--  题目信息组件   -->
      <QuestionDetails></QuestionDetails>
    </t-tab-panel>
    <t-tab-panel value="second">
      <template #label>
        <t-icon name="book-open" class="tabs-icon-margin" />
        题解
      </template>
      <p style="padding: 25px">题解</p>
    </t-tab-panel>
    <t-tab-panel value="third">
      <template #label>
        <t-icon name="time" class="tabs-icon-margin" />
        提交记录
      </template>
      <SubmitRecord></SubmitRecord>
    </t-tab-panel>
    <t-tab-panel value="forest">
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
import { ref, inject, type Ref } from 'vue'
import NoteComponent from '@/components/leftpane/NoteComponent.vue'
import QuestionDetails from '@/components/leftpane/QuestionDetails.vue'
import SubmitRecord from '@/components/leftpane/SubmitRecord.vue'

/* 获取 Tabs 位置 */
const placement = inject<Ref<string>>('questionTabsPlacement')

const value = ref('first')

const handlerChange = (newValue: string) => {
  value.value = newValue
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
