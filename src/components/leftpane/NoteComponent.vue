<template>
    <MdEditor
        v-model="text"
        previewTheme="vuepress"
        :autoDetectCode="true"
        :showCodeRowNumber="true"
        :placeholder="`支持 markdown 语法...`"
        :preview="false"
        :toolbars="tool"
        @onSave="onSave"
        @onError="onError"
        @dblclick="stopPropagationEvent"
        @onUploadImg="onUploadImg"
    />
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { MdEditor } from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'
import { useRoute } from 'vue-router'
import { NoteControllerService, UploadControllerService } from '../../../apis'
import { MessagePlugin } from 'tdesign-vue-next'
import { UserInfoStore } from '@/stores/user-info'

const route = useRoute()
const PId = route.params.PId
const userInfoStore = UserInfoStore()
const currentUserId = ref<number>(userInfoStore.$state.loginUserInfo.userId)
const text = ref<string>('')


onMounted(async () => {
    if (!userInfoStore.$state.isLogin) {
        await userInfoStore.getLoginUserInfo()
    }
    currentUserId.value = userInfoStore.$state.loginUserInfo.userId
    if (!userInfoStore.$state.isLogin) {
        await MessagePlugin.warning({
            content: '需要登录才能保存笔记！！！'
        })
    } else {
        // 加载远程存储
        await NoteControllerService.getProblemNoteByPIdAndUId(Number(PId), currentUserId.value)
            .then((res) => {
                if (res.statusCode == 0) {
                    text.value = res.data?.content ?? ''
                } else if (res.statusCode == 40004) {
                    const localData = localStorage.getItem(`note-${PId}-${currentUserId.value}`) ?? ''
                    if (localData != '') {
                        const noteData = JSON.parse(localData)
                        if (noteData != '') {
                            text.value = noteData
                        }
                        MessagePlugin.warning({
                            content: '远程加载失败: ' + res.description + ',已恢复本地笔记'
                        })
                    } else {
                        MessagePlugin.warning({
                            content: '远程加载失败: ' + res.description
                        })
                    }
                }
            })
            .catch((err) => {
                MessagePlugin.warning({
                    content: '远程加载失败: ' + err.message
                })
            })
    }
})
onBeforeUnmount(async () => {
    await saveNote()
})

// 监听文本输入
watch(text, (newVal) => {
    // 保存至本地
    localStorage.setItem(`note-${PId}-${currentUserId.value}`, JSON.stringify(newVal))
})


/* 处理图片上传 */
const onUploadImg = async (files: any, callback: any) => {
    const res = await Promise.all(
        files.map((file: any) => {
            return new Promise((rev, rej) => {
                const form = new FormData()
                form.append('file', file)
                if (!userInfoStore.$state.isLogin) {
                    MessagePlugin.error({
                        content: '请先登录'
                    })
                } else {
                    UploadControllerService.fileUpload(form as any)
                        .then((res) => {
                            rev(res)
                            MessagePlugin.success('上传成功')
                        })
                        .catch((err) => {
                            rej(err)
                            MessagePlugin.error({
                                content: '文件上传失败: ' + err.message
                            })
                        })
                }
            })
        })
    )
    callback(
        res.map((item) => {
            return item.data
        })
    )
}

/* 处理保存至云端 */
const saveNote = async () => {
    if (text.value.trim() == '') {
        return
    } else {
        await NoteControllerService.addOrUpdateProblem({
            userId: currentUserId.value,
            problemId: Number(PId),
            content: text.value
        })
            .then(res => {
                if (res.statusCode == 0) {
                    if (Number(res.data) == 1) {
                        MessagePlugin.success({
                            content: '笔记已保存至云端'
                        })
                    } else {
                        MessagePlugin.error({
                            content: '笔记未保存至云端'
                        })
                    }
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
}


// 文本保存
const onSave = async (text: string, htmlText: any) => {
    if (!userInfoStore.$state.isLogin) {
        await MessagePlugin.error({
            content: '请先登录'
        })
    } else {
        await saveNote()
    }
}


// 编辑器错误处理
const onError = (err: any) => {
    MessagePlugin.error({
        content: err.message
    })
}


const stopPropagationEvent = (event: Event) => {
    event.stopPropagation()
}

/* 工具展示 */
const tool = ref([
    'bold',
    'underline',
    'italic',
    '-',
    'title',
    'strikeThrough',
    'sub',
    'sup',
    'task',
    '-',
    'codeRow',
    'code',
    'link',
    'image',
    'table',
    'mermaid',
    'katex',
    '-',
    'revoke',
    'next',
    'save',
    '-',
    'pageFullscreen',
    'fullscreen',
    'preview',
    'catalog'
])
</script>

<style scoped>
.md-editor {
    height: 90.5vh;
}
</style>
