<template>
    <t-tabs :value="tabItem" :placement="placement" @change="handlerChange" @dblclick="resize">
        <t-tab-panel value="first">
            <template #label>
                <t-icon name="code" class="tabs-icon-margin" />
                {{ problemCode }}
            </template>
            <div style="overflow: auto; height: 100%">
                <keep-alive>
                    <MonacoCodeEditor></MonacoCodeEditor>
                </keep-alive>
            </div>
        </t-tab-panel>
        <t-tab-panel value="second">
            <template #label>
                <t-icon name="chat-poll" class="tabs-icon-margin" />
                {{ problemAI }}
            </template>
            <p style="padding: 25px">Chatgpt</p>
        </t-tab-panel>
    </t-tabs>
    <EditorConfigComponent :isDisplay="isDisplayCodeConfig2"></EditorConfigComponent>
</template>
<script setup lang="ts">
import { inject, onMounted, ref, type Ref, watch } from 'vue'
import EditorConfigComponent from '@/components/rightpane/EditorConfigComponent.vue'
import MonacoCodeEditor from '@/components/rightpane/MonacoCodeEditor.vue'

/* 获取 Tabs 位置 */
const placement: Ref<string> = inject<Ref<string>>('editorTabsPlacement') ?? ref('top')

const problemCode = ref<string>('代码')
const problemAI = ref<string>('AI')
watch(placement, (newPlacement) => {
    if (newPlacement == 'right') {
        problemCode.value = ''
        problemAI.value = ''
    } else {
        problemCode.value = '代码'
        problemAI.value = 'AI'
    }
})

// 当前选中的 Tab
const tabItem = ref('first')
/* 控制切换选项卡时是否显示 Code Config ———— 发送给 EditorConfigComponent 组件 */
const isDisplayCodeConfig2 = ref<boolean>(true)
const handlerChange = (newValue: string) => {
    tabItem.value = newValue
    isDisplayCodeConfig2.value = tabItem.value == 'first'
}

/* 是否重设尺寸 (用于双击某个 Tab 来将该 Tab 尺寸扩至限制的最大或恢复初始布局) */
const isResize = ref<boolean>(false)
const emit = defineEmits(['on-dblclick']) // 将信号传给 QuestionView 组件
const resize = () => {
    isResize.value = !isResize.value
    emit('on-dblclick', isResize)
}

onMounted(() => {
    // document.addEventListener('dblclick', (event) => {
    //     // 判断点击的目标元素是否为具有类名为 "xxx" 的 div 元素
    //     if (event.target.classList.contains('t-tabs__nav-scroll')) {
    //         // 如果是，则执行双击事件处理函数
    //         resize();
    //     }
    // });
})
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
