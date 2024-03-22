<template>
  <t-tabs :value="tabItem" :placement="placement" @change="handlerChange" @dblclick="resize" :lazy="true">
    <t-tab-panel value="first">
      <template #label>
        <t-icon name="code" class="tabs-icon-margin" />
        代码
      </template>
      <div style="overflow:auto; height: 100%">
        <keep-alive>
          <MonacoCodeEditor></MonacoCodeEditor>
        </keep-alive>
      </div>

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
  <EditorConfigComponent :isDisplay="isDisplayCodeConfig2"></EditorConfigComponent>
</template>
<script setup lang="ts">
import { inject, ref, type Ref } from 'vue'
import EditorConfigComponent from '@/components/rightpane/EditorConfigComponent.vue'
import MonacoCodeEditor from '@/components/rightpane/MonacoCodeEditor.vue'

/* 获取 Tabs 位置 */
const placement = inject<Ref<string>>("editorTabsPlacement")



// 当前选中的 Tab
const tabItem = ref('first')
/* 控制切换选项卡时是否显示 Code Config ———— 发送给 EditorConfigComponent 组件 */
const isDisplayCodeConfig2 = ref<boolean>(true);
const handlerChange = (newValue:string) => {
  tabItem.value = newValue
  isDisplayCodeConfig2.value = tabItem.value == 'first';
}


/* 是否重设尺寸 (用于双击某个 Tab 来将该 Tab 尺寸扩至限制的最大或恢复初始布局) */
const isResize =  ref<boolean>(false);
const emit = defineEmits(["on-dblclick"])   // 将信号传给 QuestionView 组件
const resize = (e :any) => {
  isResize.value = !isResize.value
  emit("on-dblclick", isResize)
}

</script>
<style>
.tabs-icon-margin {
  margin-right: 4px;
}

.t-tabs__content {
  overflow: auto;
}
.t-tab-panel {
  overflow: auto;
}

</style>
