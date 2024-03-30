<template>
    <t-tabs :value="TabValue" :placement="placement" @change="handlerChange" @dblclick="resize">
        <t-tab-panel value="first">
            <template #label>
                <t-icon name="measurement-1" class="tabs-icon-margin" />
                {{ codeTest }}
            </template>
            <div class="runTab" @dblclick="stopPropagationEvent">
                <div class="submitPane">
                    <t-space style="margin-top: 10px">
                        <t-button
                            theme="default"
                            variant="base"
                            :loading="testing"
                            @click="pushTest"
                        >
                            <t-icon name="code-1" class="icon-margin" />
                            调试</t-button
                        >
                        <t-button theme="success" :loading="runing" @click="pushRun">
                            <t-icon name="cloud-upload" class="icon-margin" />
                            提交</t-button
                        >
                    </t-space>

                    <t-divider />

                    <t-textarea
                        v-model="TestValue"
                        placeholder="请输入测试用例..."
                        @change="getTestValue"
                        :readonly="testing || runing"
                    />
                </div>
                <div class="tdesign-demo-block" v-show="testing || runing">
                    <t-steps :current="current" :readonly="true" status="process">
                        <t-step-item title="提交" :content="submitContent" />
                        <t-step-item title="编译" :content="compileContent" />
                        <t-step-item title="运行" :content="runContent" />
                    </t-steps>
                </div>
            </div>
        </t-tab-panel>
        <t-tab-panel value="second">
            <template #label>
                <t-icon name="calendar" class="tabs-icon-margin" /> {{ codeResult }}
            </template>

            <div @dblclick="stopPropagationEvent">执行结果</div>
        </t-tab-panel>
    </t-tabs>
</template>
<script setup lang="ts">
import { ref, inject, type Ref, watch } from 'vue'

/* 获取 Tabs 位置 */
const placement: Ref<string> = inject<Ref<string>>('TestRunTabsPlacement') ?? ref('top')
const codeTest = ref<string>('测试')
const codeResult = ref<string>('结果')
watch(placement, (newPlacement) => {
    if (newPlacement == 'right') {
        codeTest.value = ''
        codeResult.value = ''
    } else {
        codeTest.value = '测试'
        codeResult.value = '结果'
    }
})

const TabValue = ref('first')

const TestValue = ref('')
const getTestValue = (value: string, e: any) => {
    console.log('输入的测试用例为: ', value)
}

const testing = ref<boolean>(false)
const pushTest = () => {
    current.value++
    submitContent.value = '提交成功'
    testing.value = true

    // todo 代码编译
    setTimeout(() => {
        current.value++
        compileContent.value = '编译成功'
    }, 1000)

    // todo 代码运行
    setTimeout(() => {
        runContent.value = '运行成功'
    }, 2000)

    setTimeout(() => {
        testing.value = false
        TabValue.value = 'second'
        current.value = 0
    }, 2500)
}

const runing = ref<boolean>(false)
const pushRun = () => {
    current.value++
    submitContent.value = '提交成功'
    runing.value = true

    // todo 代码编译
    setTimeout(() => {
        current.value++
        compileContent.value = '编译成功'
    }, 1000)

    // todo 代码运行
    setTimeout(() => {
        runContent.value = '运行成功'
    }, 2000)

    setTimeout(() => {
        runing.value = false
        TabValue.value = 'second'
        current.value = 0
    }, 2500)
}

const submitContent = ref<string>('')
const compileContent = ref<string>('')
const runContent = ref<string>('')
const current = ref<number>(0)

const handlerChange = (newValue: string) => {
    TabValue.value = newValue
    if (TabValue.value == 'first') {
        submitContent.value = ''
        compileContent.value = ''
        runContent.value = ''
    }
}

// 是否重设尺寸 (用于双击某个 Tab 来将该 Tab 尺寸扩至限制的最大)
const isResize = ref<boolean>(false)
const emit = defineEmits(['on-r-dblclick'])
const resize = () => {
    isResize.value = !isResize.value
    emit('on-r-dblclick', isResize)
    // console.log(isResize.value)
}

const stopPropagationEvent = (event: Event) => {
    event.stopPropagation();
}
</script>
<style lang="less" scoped>
.tabs-icon-margin {
    margin-right: 4px;
}
.icon-margin {
    margin-top: 3px;
    margin-right: 4px;
}

.runTab {
    display: flex;
    flex-wrap: wrap;
    overflow: auto;
    height: 100%;
}
.submitPane {
    margin: 10px;
    min-width: 55%;
}
.tdesign-demo-block {
    margin-top: 40px;
    margin-left: 10px;
    display: flex;
    justify-content: space-around;
    min-width: 40%;
}
</style>
