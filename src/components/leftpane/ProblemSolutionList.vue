<template>
    <div class="solutionList" @dblclick="stopPropagationEvent">
        <div class="solutionListHeader">
            <div class="solutionListSearch" >
                <SearchIcon style="color: #909090; padding-left: 10px; padding-right: 6px; padding-top: 2px" size="18" />
                <input class="searchSolutionInput" placeholder="搜索题解" v-model="searchText">
                <t-button theme="primary" size="small" style="flex: 1; margin-right: 10px" @click="submitSearch">搜索</t-button>
            </div>
            <t-button theme="default" style="margin: 5px 10px;" @click="toCreateSolution">
                <Edit1Icon style="padding-top: 3px; padding-right: 3px" />
                {{createText}}</t-button>
        </div>

        <div class="noSolution" v-show="!isHaveProblemSolution">
            <span style="color: #c4c4c4; font-size: 15px">本题目暂无题解</span>
        </div>

        <div class="solutionListContent" v-show="isHaveProblemSolution">
            <t-list :key="index" :split="true" v-for="(item, index) in problemSolutionList">
                <t-list-item @click="toThisSolution(item.problemSolutionId ?? 0)">
                    <t-list-item-meta :image="'http://localhost:3000'+item.userAvatar" :title="item.title" :description="item.profile" />
                    <template #action>
                        <t-space
                            :key="index"
                            v-for="(i, index) in item.tags"
                            style="margin-right: 5px"
                        >
                            <t-tag style="color: #7f7f7f" variant="light" size="medium" shape="round">{{ i }}</t-tag>
                        </t-space>
                    </template>
                </t-list-item>
            </t-list>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { Edit1Icon, SearchIcon } from 'tdesign-icons-vue-next'
import { MessagePlugin } from 'tdesign-vue-next'
import { useRoute, useRouter } from 'vue-router'
import { ProblemSolutionControllerService, type ProblemSolutionRepositoryResponse } from '../../../apis'
import { UserInfoStore } from '@/stores/user-info'

const searchText = ref<string>('');
const submitSearch = () => {
    if (searchText.value == '') {
        MessagePlugin.warning({ content: '请输入要搜索的内容', placement: 'top'})
    }
    else if (!isHaveProblemSolution.value) {
        MessagePlugin.warning({ content: '本题目暂无题解', placement: 'top'})
    }
    else {
        // todo 搜索题解

    }
}

const route = useRoute();
const router = useRouter();
const PId = route.params.PId;
const userInfoStore = UserInfoStore()

const addOrModifySolution = ref<boolean>(); // true: 添加, false: 修改
const createText = computed(() => {
    return addOrModifySolution.value ? '发布题解' : '修改题解'
})
const problemSolutionId = ref<number>(-1)

const toCreateSolution = async () => {
    if (!userInfoStore.$state.isLogin) {
        await MessagePlugin.warning({
            content: "请先登录"
        })
    }
    else {
        const resolved = router.resolve({
            name: "CreateProblemSolution",
            params: {
                PSId: problemSolutionId.value
            }
        });
        window.open(resolved.href, '_blank');
    }
}


const problemSolutionList = ref<Array<ProblemSolutionRepositoryResponse>>();
const isHaveProblemSolution = ref<boolean>(true)
const getProblemSolutionsByPId = async (PId: number) => {
    await ProblemSolutionControllerService.getProblemSolutionByPId(PId)
        .then(res => {
            if (res.statusCode == 0) {
                problemSolutionList.value = res.data
            }
            else if (res.statusCode == 40004) {
                isHaveProblemSolution.value = false
                MessagePlugin.warning({
                    content: res.description
                })
            }
            else {
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

onMounted(async () => {
    if (!userInfoStore.$state.isLogin) {
        await userInfoStore.getLoginUserInfo()
    }
    await ProblemSolutionControllerService.isHaveProblemSolution(Number(PId), userInfoStore.$state.loginUserInfo.userId)
        .then(res => {
            if (res.statusCode == 0) {
                addOrModifySolution.value = res.data == null
                problemSolutionId.value = res.data ?? -1
            }
            else if (res.statusCode == 40004) {
                addOrModifySolution.value = true
            }
            else {
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
    await getProblemSolutionsByPId(Number(PId));
})


// 点击去往对应的题解页
const toThisSolution = (PSId: number) => {
    const resolved = router.resolve({
        name: "ProblemSolutionDisplay",
        params: {
            PSId: PSId
        }
    })
    window.open(resolved.href, '_blank');
}


const stopPropagationEvent = (event: Event) => {
    event.stopPropagation();
}
</script>

<style>
.t-list-item__meta-avatar {
    width: 45px !important;
    height: 45px !important;
}
.t-list-item__meta-description {
    margin-bottom: 0px !important;
}
.t-list-item {
    transition: background-color 0.4s ease !important;
}
.t-list-item:hover {
    background-color: #E8E8E8 !important;
    cursor: pointer !important;
}
.solutionList {
    display: flex;
    flex-direction: column;
}
.solutionListHeader {
    display: flex;
    flex-direction: column;
}
.solutionListSearch {
    display: flex;
    flex-wrap: nowrap;
    padding-top: 7px;
    padding-bottom: 5px;
    border-bottom: 1px solid #e8e8e8;
}
.searchSolutionInput {
    border: none;
    outline: none;
    font-size: 14px;
    width: 90%;
    flex: 5;
}
.searchSolutionInput::placeholder {
    color: #DBDBDC;
}
.solutionListContent {
    height: 82.5vh;
    overflow: auto;
}
.solutionListContent::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px rgb(193, 193, 193);
    background-color: #f5f5f5;
    border-radius: 10px;
}
.solutionListContent::-webkit-scrollbar {
    width: 6px;
    background-color: #f5f5f5;
    border-radius: 10px;
}
.solutionListContent::-webkit-scrollbar-thumb {
    background-color: #C1C1C1;
    border-radius: 10px;
}
.noSolution {
    height: 70vh;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>