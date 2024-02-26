<template>
  <t-tabs :value="value" @change="handlerChange" :lazy="true">
    <t-tab-panel value="first">
      <template #label>
        <t-icon name="check-circle" class="tabs-icon-margin" />
        最近 AC
      </template>
      <!--  题目信息组件   -->
      <div style="max-width: 52vw">
        <RecentlySolution></RecentlySolution>
      </div>
    </t-tab-panel>
    <t-tab-panel value="second">
      <template #label>
        <t-icon name="book-open" class="tabs-icon-margin" />
        题解
      </template>
      <p style="padding: 25px">题解</p>
    </t-tab-panel>
  </t-tabs>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import QuestionDetails from '@/components/leftpane/ProblemDetails.vue'
import RecentlySolution from '@/components/recently/RecentlySolution.vue'

const value = ref('first')

const handlerChange = (newValue: string) => {
  value.value = newValue
}


</script>
<style scoped>
.tabs-icon-margin {
  margin-right: 4px;
}
</style>
