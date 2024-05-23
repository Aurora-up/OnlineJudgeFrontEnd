<template>
    <div class="solutionDisplayContainer">
        <div class="solutionDisplayCard" ref="solutionDisplayCard">
            <div class="solutionDHeader">
                <h2>{{ solutionTitle }}</h2>
                <div>
                    <div style="display: flex; ">
                        <img :src="tackleFileUrlPrefix(userAvatar ?? '')" alt="user" class="userImg" @click="toUserInfo" />
                        <div>
                            <div style="font-weight: bold; margin-left: 10px; padding: 0" @click="toUserInfo">
                                <span class="userName">{{userName}}</span>
                            </div>
                            <CalendarIcon style="margin-left: 10px; color: #A8A8A8" size="13" />
                            <span style="color: #737373; font-size: 12px; margin-left: 5px; padding: 0">{{ updateTime }}</span>
                        </div>

                    </div>
                </div>
            </div>
            <div style="margin-left: 20px">
                <t-space
                    :key="index"
                    v-for="(i, index) in tags"
                    style="margin-right: 5px"
                >
                    <t-tag style="color: #7f7f7f" variant="light" size="medium" shape="round">{{ i }}</t-tag>
                </t-space>
            </div>
            <div>
                <MdPreview
                    previewTheme="vuepress"
                    editorId="preview-only"
                    :modelValue="text"
                />
            </div>
            <FooterComponent></FooterComponent>
        </div>
    </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { MdPreview } from 'md-editor-v3'
import { ProblemSolutionControllerService } from '../../../apis'
import { MessagePlugin } from 'tdesign-vue-next'
import { useRoute } from 'vue-router'
import FooterComponent from '@/components/FooterComponent.vue'
import { tackleFileUrlPrefix } from '@/utils/data-tackle'
import { CalendarIcon } from 'tdesign-icons-vue-next'

const route = useRoute()
const PSId = route.params.PSId

const solutionDisplayCard = ref<HTMLDivElement>();
const initialWidth = ref<number>(897)

const solutionTitle = ref<string>();
const tags = ref<string[]>([])
const text = ref<string>()
const userAvatar = ref<string>()
const userName = ref<string>()
const updateTime = ref<string>()
const userId = ref<number>()

onMounted(async () => {
    if (window.innerWidth <= initialWidth.value) { solutionDisplayCard.value.style.width = `${window.innerWidth}px` }
    else { solutionDisplayCard.value.style.width = `${initialWidth.value}px` }

    await ProblemSolutionControllerService.getProblemSolutionByPsId(Number(PSId))
        .then(res => {
            if (res.statusCode == 0) {
                console.log(res.data)
                solutionTitle.value = res.data?.title ?? ''
                tags.value = res.data?.tags ?? []
                text.value = res.data?.content ?? ''
                userAvatar.value = res.data?.userAvatar ?? ''
                userName.value = res.data?.userName
                updateTime.value = res.data?.updateTime?.replaceAll("-", ".")
                userId.value = res.data?.userId;
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
    console.log(tackleFileUrlPrefix(userAvatar.value ?? ''))
})
const handleWindowResize = () => {
    if (window.innerWidth <= initialWidth.value) {
        solutionDisplayCard.value.style.width = `${window.innerWidth}px`
    }
    else {
        solutionDisplayCard.value.style.width = `${initialWidth.value}px`
    }
};
window.addEventListener('resize', handleWindowResize);

const toUserInfo = () => {
    console.log(userId.value)
}

</script>

<style scoped>
.solutionDisplayContainer {
    height: 100vh;
    margin: 0;
    background-color: #f7f8fa;
    display: flex;
    justify-content: center;
}
.solutionDisplayCard {
    background-color: #ffffff;
    overflow: auto;
    height: 95vh;
    box-shadow: 0px 0px 14px 4px rgba(0, 0, 0, 0.1);
}
.solutionDisplayCard::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px rgb(193, 193, 193);
    background-color: #f5f5f5;
    border-radius: 10px;
}
.solutionDisplayCard::-webkit-scrollbar {
    width: 6px;
    background-color: #f5f5f5;
    border-radius: 10px;
}
.solutionDisplayCard::-webkit-scrollbar-thumb {
    background-color: #C1C1C1;
    border-radius: 10px;
}

.solutionDHeader {
    padding-left: 20px;
    padding-right: 20px;
    padding-bottom: 15px;
}
.userImg {
    width: 38px;
    height: 38px;
}
.userImg:hover {
    cursor: pointer;
}
.userName:hover {
    color: #007AFF;
    cursor: pointer;
}
</style>