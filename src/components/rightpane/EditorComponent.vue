<template>
  <t-tabs :value="value" :placement="placement" @change="handlerChange" @dblclick="resize">
    <t-tab-panel value="first">
      <template #label>
        <t-icon name="code" class="tabs-icon-margin" />
        代码
      </template>
      <CodeEditor></CodeEditor>
    </t-tab-panel>
    <t-tab-panel value="second">
      <template #label>
        <t-icon name="chat-poll" class="tabs-icon-margin" />
        AI
      </template>
      <p style="padding: 25px">
        Chatgpt
      </p>
    </t-tab-panel>
  </t-tabs>
</template>
<script setup lang="ts">
import { inject, ref, type Ref } from 'vue'
import CodeEditor from '@/components/rightpane/CodeEditor.vue'

/* 获取 Tabs 位置 */
const placement = inject<Ref<string>>("editorTabsPlacement")


// 当前选中的 Tab
const value = ref('first')
const handlerChange = (newValue:string) => {
  value.value = newValue
}

// 是否重设尺寸 (用于双击某个 Tab 来将该 Tab 尺寸扩至限制的最大)
const isResize =  ref<boolean>(false);
const emit = defineEmits(["on-dblclick"])
const resize = (e) => {
  isResize.value = !isResize.value
  emit("on-dblclick", isResize)
  console.log(isResize.value)
}

</script>
<style scoped>
.tabs-icon-margin {
  margin-right: 4px;
}
</style>
