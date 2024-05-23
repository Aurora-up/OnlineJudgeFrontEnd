<template>
    <t-tabs :value="tabItem" :placement="placement" @change="handlerChange" @dblclick="resize">
        <t-tab-panel value="first">
            <template #label>
                <t-icon name="code" class="tabs-icon-margin" />
                {{ problemCode }}
            </template>
            <EditorConfigComponent @on-full-screen="getFullScreenTip"></EditorConfigComponent>
            <div style="overflow: auto; height: 100%">
                <keep-alive>
                    <MonacoCodeEditor></MonacoCodeEditor>
                </keep-alive>
            </div>
        </t-tab-panel>
    </t-tabs>
</template>
<script setup lang="ts">
import { inject, ref, type Ref, watch } from 'vue'
import EditorConfigComponent from '@/components/rightpane/EditorConfigComponent.vue'
import MonacoCodeEditor from '@/components/rightpane/MonacoCodeEditor.vue'

/* 获取 Tabs 位置 */
const placement: Ref<string> = inject<Ref<string>>('editorTabsPlacement') ?? ref('top')

const problemCode = ref<string>('代码')
watch(placement, (newPlacement) => {
    if (newPlacement == 'right') {
        problemCode.value = ''
    } else {
        problemCode.value = '代码'
    }
})

// 当前选中的 Tab
const tabItem = ref('first')

const handlerChange = (newValue: string) => {
    tabItem.value = newValue
}

/* 是否重设尺寸 (用于双击某个 Tab 来将该 Tab 尺寸扩至限制的最大或恢复初始布局) */
const isResize = ref<boolean>(false)
const emit = defineEmits(['on-dblclick']) // 将信号传给 QuestionView 组件
const resize = () => {
    isResize.value = !isResize.value
    emit('on-dblclick', isResize)
}

const getFullScreenTip = (isFullScreen: boolean) => {
    isResize.value =isFullScreen;
    emit('on-dblclick', isResize)
}

</script>
<style scoped>
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
