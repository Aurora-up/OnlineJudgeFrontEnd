<template>
    <div class="qDetails">
        <div style="margin-left: 20px">
            <h1 style="font-size: 27px">{{ PID }}. {{ QName }}</h1>
        </div>
        <div style="margin-left: 20px">
            <t-tag theme="success" variant="outline" shape="round">{{ Tag1 }}</t-tag>
            <t-space :key="index" v-for="(item, index) in Tag2" style="margin-left: 10px">
                <t-tag shape="round">{{ item }}</t-tag>
            </t-space>
        </div>
        <div>
            <MdPreview previewTheme="github" editorId="preview-only" :modelValue="QTest" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { inject, onMounted, ref } from 'vue'
import { MdPreview } from 'md-editor-v3'
import 'md-editor-v3/lib/preview.css'

const PId = inject<number>('PId')
onMounted(() => {
    PID.value = PId ?? 0
})

const PID = ref<number>(1)
const QName = ref<string>('A + B')

const QDescribe = ref<string>('输入两个整数，求这两个整数的和是多少。')

// 难易程度标签
const Tag1 = ref<string>('简单')
// 题目归类标签
const Tag2 = ref<string[]>(['模拟'])

const QTest = ref<string>(
    `### 题目描述

输入两个正整数，求这两个整数的和是多少。

------

#### 输入格式

输入两个整数 A，B， 用空格隔开


#### 输出格式

输出一个整数，表示这两个数的和

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
#### 时间/空间限制:  \`1s / 64MB\``
)

//
//
// const InputCriterion = ref<string>("输入两个整数 A , B\n" +
//   "，用空格隔开")
//
// const outputCriterion = ref<string>('输出一个整数，表示这两个数的和');
//
// const EInputText = ref<string>("3 4")
// const EInput = ref<string>(
//   "```text\n" +
//   EInputText.value + "\n" +
//   "```"
// )
//
// const EOutputText = ref<string>("7")
// const EOutput = ref<string>(
//   "```text\n" +
//   EOutputText.value + "\n" +
//   "```"
// )
//
// const dataRange = ref<string>(
//   "0 ≤ A, B ≤ 10^8"
// )
//
// const Text = ref<string>(
//   "##### 数据范围: \n" +
//   "$" +
//   dataRange.value +
//   "$\n" +
//   "##### 样例输入: \n" +
//   "```text\n" +
//   EInputText.value + "\n" +
//   "```\n"
//   +
//   "#### 样例输出: \n" +
//   "```text\n" +
//   EOutputText.value + "\n" +
//   "```"
// )
</script>

<style scoped>
.qDetails {
    overflow: auto;
    height: 86vh;
}
</style>
