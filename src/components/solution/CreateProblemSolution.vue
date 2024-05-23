<template>
    <div class="solutionDisplayContainer">
        <div class="solutionDisplayCard" ref="solutionCard">
            <div class="solutionHeader">
                <input placeholder="请输入标题" class="titleInput" v-model="solutionTitle" />
                <div class="solutionOperation">
                    <t-button theme="default" variant="base" class="cancelSubmit" @click="cancelSubmitSolution">取消
                    </t-button>
                    <t-button
                        theme="default"
                        variant="base"
                        class="submitSolution"
                        @click="submitSolution"
                    >
                        <svg
                            t="1712241474388"
                            class="submitSolutionIcon"
                            viewBox="0 0 1024 1024"
                            version="1.1"
                            xmlns="http://www.w3.org/2000/svg"
                            p-id="6522"
                            width="16"
                            height="16"
                        >
                            <path
                                d="M469.333333 597.333333a42.666667 42.666667 0 0 1-30.293333-12.373333 42.666667 42.666667 0 0 1 0-60.586667l469.333333-469.333333a42.666667 42.666667 0 1 1 60.586667 60.586667l-469.333333 469.333333A42.666667 42.666667 0 0 1 469.333333 597.333333z"
                                p-id="6523"
                                fill="#ffffff"
                            ></path>
                            <path
                                d="M640 981.333333a42.666667 42.666667 0 0 1-38.826667-25.173333l-164.266666-369.066667-369.066667-164.266666a42.666667 42.666667 0 0 1 3.413333-78.933334l853.333334-298.666666a42.666667 42.666667 0 0 1 54.186666 54.186666l-298.666666 853.333334A42.666667 42.666667 0 0 1 640 981.333333zM200.96 388.693333l285.866667 128a42.666667 42.666667 0 0 1 21.333333 21.333334l128 285.866666 232.96-669.013333z"
                                p-id="6524"
                                fill="#ffffff"
                            ></path>
                        </svg>
                        {{ createText }}
                    </t-button>
                </div>
            </div>
            <div class="tagInput">
                <t-tag-input v-model="tags" clearable placeholder="输入来添加标签️" max="7" />
            </div>
            <div class="solutionContent">
                <MdEditor
                    ref="editorRef"
                    v-model="text"
                    previewTheme="vuepress"
                    :autoFocus="true"
                    :autoDetectCode="true"
                    :showCodeRowNumber="true"
                    :placeholder="`支持 markdown 语法...`"
                    :preview="true"
                    :toolbars="tool"
                    @onSave="onSave"
                    @onError="onError"
                    :formatCopiedText="formatCopiedText"
                />
                <div></div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { MdEditor } from 'md-editor-v3'
import { MessagePlugin } from 'tdesign-vue-next'
import { ProblemSolutionControllerService } from '../../../apis'
import { useRoute, useRouter } from 'vue-router'
import { UserInfoStore } from '@/stores/user-info'

const route = useRoute()
const router = useRouter()
const PId = route.params.PId
const userInfoStore = UserInfoStore()
const PSId = route.params.PSId

const solutionTitle = ref<string>('')
const tags = ref<string[]>([])
const text = ref()
const addOrModifySolution = ref<boolean>() // true: 添加, false: 修改
const createText = computed(() => {
    return addOrModifySolution.value ? '发布题解' : '修改题解'
})



/* 提交题解 */
const submitSolution = async () => {
    if (solutionTitle.value == '') {
        await MessagePlugin.warning({
            content: '请输入标题后提交',
            placement: 'top'
        })
    } else if (!userInfoStore.$state.isLogin) {
        await MessagePlugin.warning({
            content: '请先登录',
            placement: 'top'
        })
    }
    await addProblemSolution()
    // todo npm返回题解页

}

/* 取消提交题解 */
const cancelSubmitSolution = () => {
    window.location.href = `/problem/${PId}/solution`
}

const addProblemSolution = async () => {
    await ProblemSolutionControllerService.addProblemSolution({
        id: Number(PSId),
        problemId: Number(PId),
        userId: userInfoStore.$state.loginUserInfo.userId,
        title: solutionTitle.value,
        content: text.value,
        tags: tags.value
    })
        .then(res => {
            if (res.statusCode == 0) {
                MessagePlugin.success({
                    content: 'success'
                })
            } else {
                MessagePlugin.error({
                    content: res.description
                })
            }
        })
        .catch(err => {
            MessagePlugin.error({
                content: err.message
            })
        })
}

// 监听文本输入
watch(text, (newVal, oldVal) => {

    // console.log(newVal, oldVal)
})

// 文本保存
const onSave = (text: string, htmlText: any) => {

}

// 错误处理
const onError = (err: any) => {
    alert(err.message)
}


/* 工具展示 */
const tool = ref([
    'title',
    'bold',
    'italic',
    'task',
    'code',
    'link',
    'image',
    'table',
    'mermaid',
    'katex',
    'save',
    'pageFullscreen',
    'fullscreen',
    'preview',
    'catalog'
])

const formatCopiedText = (text: string) => {
    return `${text}  - from AuroraOJ`
}

const solutionCard = ref<HTMLDivElement>();
const initialWidth = ref<number>(1197)

onMounted(async () => {
    if (window.innerWidth <= initialWidth.value) {
        solutionCard.value.style.width = `${window.innerWidth}px`
    }
    else {
        solutionCard.value.style.width = `${initialWidth.value}px`
    }
    if (!userInfoStore.$state.isLogin) {
        await userInfoStore.getLoginUserInfo()
    }
    addOrModifySolution.value = Number(PSId) == -1
    if (Number(PSId) == -1) {

    } else {
        await ProblemSolutionControllerService.getProblemSolutionByPsId(Number(PSId))
            .then(res => {
                if (res.statusCode == 0) {
                    solutionTitle.value = res.data?.title ?? ''
                    tags.value = res.data?.tags ?? []
                    text.value = res.data?.content ?? ''
                } else {
                    MessagePlugin.warning({
                        content: res.description
                    })
                }
            })
            .catch(err => {
                MessagePlugin.warning({
                    content: err.message
                })
            })
    }
})
const handleWindowResize = () => {
    if (window.innerWidth <= initialWidth.value) {
        solutionCard.value.style.width = `${window.innerWidth}px`
    }
    else {
        solutionCard.value.style.width = `${initialWidth.value}px`
    }
};
window.addEventListener('resize', handleWindowResize);

</script>

<style scoped>
.solutionDisplayContainer {
    width: 100vw;
    height: 100vh;
    margin: 0;
    background-color: #f7f8fa;
    display: flex;
    justify-content: center;
}

.solutionDisplayCard {
    background-color: #ffffff;
    box-shadow: 0px 0px 14px 4px rgba(0, 0, 0, 0.1);

    display: flex;
    flex-direction: column;
}

.solutionHeader {
    display: flex;
    padding-left: 18px;
    padding-right: 18px;
    padding-top: 10px;
}

.titleInput {
    font-size: 22px;
    border: none;
    outline: none;
    flex: 1;
}

.titleInput::placeholder {
    color: #c4c4c6;
}

.solutionOperation {
}

.cancelSubmit {
    margin-right: 10px;
    border-radius: 7px;
    color: #595959;
    background-color: #f2f2f4;
}

.cancelSubmit:hover {
    background-color: #e5e6e8;
}

.submitSolution {
    background-color: #366ef4;
    color: #ffffff;
    border-radius: 7px;
}

.submitSolutionIcon {
    margin-top: 3px;
    margin-right: 2px;
}

.submitSolution:hover {
    background-color: #0052d9;
}

.tagInput {
    padding: 13px 18px 10px;
}

.solutionContent {
    width: 100%;
}

.md-editor {
    height: 86vh;
}
</style>
