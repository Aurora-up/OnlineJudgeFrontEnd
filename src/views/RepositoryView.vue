<template>
    <div class="ex-repository-contain">
        <div class="repository-contain" >
            <div class="repository-l-contain" ref="repositoryLContain">
                <t-card :bordered="false" :shadow="true">
                    <div class="repository-content">
                        <h1>Aurora Online Judge 题库</h1>

                        <div style="width: 50%; display: flex">
                            <t-input
                                placeholder="根据题目标题、描述、标签、来源搜索题目"
                                clearable
                                size="medium"
                                style="width: 90%"
                                v-model="searchKeywords"
                                :onEnter="searchProblem"
                                ref="inputContain"
                            ></t-input>
                            <t-tooltip content="搜索">
                                <t-button shape="circle" variant="text" @click="searchProblem">
                                    <SearchIcon size="20" />
                                </t-button>
                            </t-tooltip>
                        </div>

                        <t-divider></t-divider>

                        <!-- 当数据为空需要占位时，会显示 cellEmptyContent -->
                        <t-table
                            row-key="index"
                            :data="problemRepositoryData"
                            :columns="columns"
                            :stripe="true"
                            :bordered="false"
                            :hover="true"
                            table-layout="fixed"
                            size="small"
                            :pagination="pagination"
                            cell-empty-content="-"
                        >
                        </t-table>
                    </div>
                </t-card>
            </div>
            <div class="calendar-contain">
                <Calendar></Calendar>
            </div>
        </div>

        <FooterComponent></FooterComponent>
    </div>
</template>

<script setup lang="jsx">
import { getCurrentInstance, onMounted, ref , watch} from 'vue'
import { SearchIcon } from 'tdesign-icons-vue-next'
import { useRouter } from 'vue-router'
import FooterComponent from '@/components/FooterComponent.vue'
import Calendar from '@/components/CalendarComponent.vue'
import { ProblemControllerService } from '../../apis/index'
import { MessagePlugin } from 'tdesign-vue-next'
import { UserInfoStore } from '@/stores/user-info'

/* 题库题目 */
const problemRepositoryData = ref([]) // 题目数据
let problemNums = ref(0) // 题目总数
// 题目可能的状态映射集合
const ProblemStateList = {
    0: { label: '-', theme: 'default-icon', icon: 'minus-circle' },
    1: { label: 'AC', theme: 'success-icon', icon: 'check-circle' },
    2: { label: 'ER', theme: 'danger-icon', icon: 'close-circle' },
    3: { label: 'TO', theme: 'warning-icon', icon: 'close-circle' }
}
// 题目可能的难度映射集合
const ProblemDifficultList = {
    0: { label: '简单', theme: 'success' },
    1: { label: '中等', theme: 'warning' },
    2: { label: '困难', theme: 'danger' }
}
// 题库表格显示的数据样式
const columns = ref([
    {
        colKey: 'status',
        title: '状态',
        cell: (h, { row }) => {
            return (
                <t-icon
                    name={ProblemStateList[row.status].icon}
                    class={ProblemStateList[row.status].theme}
                />
            )
        },
        width: '50'
    },
    { colKey: 'PID', title: '题号', width: '50' },
    {
        colKey: 'Problem',
        title: '题目',
        width: '430',
        cell: (h, { row }) => {
            return (
                <t-link
                    theme="default"
                    hover="underline"
                    onClick={() => handleClickProblemLink(row.PID)}
                >
                    {' '}
                    {row.Problem}{' '}
                </t-link>
            )
        }
    },
    {
        colKey: 'passRate',
        title: '通过率',
        ellipsis: true,
        cell: (h, { row }) => {
            return (
                <span>
                    {row.passRate}
                    {'%'}{' '}
                </span>
            )
        },
        width: '70'
    },
    {
        colKey: 'Difficulty',
        title: '难度',
        ellipsis: true,
        cell: (h, { row }) => {
            return (
                <t-tag
                    shape="round"
                    theme={ProblemDifficultList[row.Difficulty].theme}
                    variant="light-outline"
                >
                    {ProblemDifficultList[row.Difficulty].label}
                </t-tag>
            )
        },
        width: '70'
    }
])

/* 处理跳转至对应的题目页 */
const router = useRouter()
const handleRowClick = (...rows) => {}
const handleClickProblemLink = (pid) => {
    router.push({
        name: 'ProblemDescription',
        params: {
            PId: pid
        }
    })
}

/* 加载题库数据, 传递参数 */
const userInfoStore = UserInfoStore()
const problemRepository = ref({})
const currentComponentInstance = getCurrentInstance()

const repositoryLContain = ref()
const initialWidth = ref(987)

const handleWindowResize = () => {
    if (window.innerWidth <= initialWidth.value) {repositoryLContain.value.style.width = `${window.innerWidth}px` }
    else { repositoryLContain.value.style.width = `${initialWidth.value}px` }
};
window.addEventListener('resize', handleWindowResize);

onMounted(async () => {
    /* 宽度调整 */
    if (window.innerWidth <= initialWidth.value) {repositoryLContain.value.style.width = `${window.innerWidth}px` }
    else { repositoryLContain.value.style.width = `${initialWidth.value}px` }

    /* 登录状态保持 */
    if (!userInfoStore.$state.isLogin) {
        await userInfoStore.getLoginUserInfo()
    }

    /* 数据请求 */
    let repositoryResponse
    // 未登录是默认使用 UID 为 2 的普通用户进行显示
    if (!userInfoStore.$state.isLogin) {
        repositoryResponse = await ProblemControllerService.getAllProblemByUserId(2).catch((e) => {
            MessagePlugin.error({
                content: "服务端出错: " + e?.message + " —— " + e?.name
            })
        })
    } else {
        repositoryResponse = await ProblemControllerService.getAllProblemByUserId(
            userInfoStore.$state.loginUserInfo.userId
        )
    }
    if (repositoryResponse.statusCode === 0) {
        problemRepository.value = repositoryResponse.data
    } else {
        await MessagePlugin.warning({
            content: repositoryResponse.description
        })
    }
    problemNums.value = problemRepository.value.length
    if (problemNums.value !== 0) {
        for (let i = 0; i < problemNums.value; i++) {
            problemRepositoryData.value.push({
                index: problemRepository.value.map((e) => e.problemId)[i],
                status: problemRepository.value.map((e) => e.status)[i],
                PID: problemRepository.value.map((e) => e.problemId)[i],
                Problem: problemRepository.value.map((e) => e.title)[i],
                passRate: problemRepository.value.map((e) => {
                    if (e.submitNum === 0) {
                        return 0
                    } else {
                        return ((e.acceptedNum / e.submitNum) * 100).toFixed(2)
                    }
                })[i],
                Difficulty: problemRepository.value.map((e) => e.difficult)[i]
            })
        }
    }
    currentComponentInstance?.proxy?.$Bus.emit('problem-total', problemNums.value)
    localStorage.setItem('problem-total', JSON.stringify(problemNums.value))
})

/* 题目搜索 */
const searchKeywords = ref('') // 搜索关键词
const searchProblem = async () => {
    //  触发搜索
    let repositoryResponse
    if (searchKeywords.value === '') {
        repositoryResponse = await ProblemControllerService.getAllProblemByUserId(
            userInfoStore.$state.loginUserInfo.userId
        )
    } else {
        repositoryResponse = await ProblemControllerService.searchProblem(searchKeywords.value)
            .catch((e) => {
            MessagePlugin.error({
                content: e.message
            })
        })
    }
    // 结果处理
    if (repositoryResponse.statusCode === 0) {
        problemRepository.value = repositoryResponse.data
    } else {
        await MessagePlugin.warning({
            content: repositoryResponse.description
        })
    }
    problemNums.value = problemRepository.value.length
    problemRepositoryData.value = []
    if (problemNums.value !== 0) {
        for (let i = 0; i < problemNums.value; i++) {
            problemRepositoryData.value.push({
                index: problemRepository.value.map((e) => e.problemId)[i],
                status: problemRepository.value.map((e) => e.status)[i],
                PID: problemRepository.value.map((e) => e.problemId)[i],
                Problem: problemRepository.value.map((e) => e.title)[i],
                passRate: problemRepository.value.map((e) => {
                    if (e.submitNum === 0) {
                        return 0
                    } else {
                        return ((e.acceptedNum / e.submitNum) * 100).toFixed(2)
                    }
                })[i],
                Difficulty: problemRepository.value.map((e) => e.difficult)[i]
            })
        }
    }
}

// 分页数据
const pagination = ref({
    defaultCurrent: 1,
    defaultPageSize: 20,
    total: problemNums.value
})
watch(problemNums, (n) => {
    pagination.value  = {
        defaultCurrent: 1,
        defaultPageSize: 20,
        total: n
    }
})

</script>

<style>
.success-icon {
    color: green;
}

.danger-icon {
    color: crimson;
}

.default-icon {
    color: #768390;
}

.warning-icon {
    color: orange;
}

.ex-repository-contain {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    background-color: #f7f8fa;
    align-items: center;
    overflow: auto;
}

.repository-contain {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    width: 73%;
}

.repository-l-contain {
    margin-top: 10px;
    flex: 4;
}

.calendar-contain {
    margin-top: 10px;
    margin-left: 10px;
    display: flex;
    justify-content: center;
}

.repository-content {
    width: 100%;
    display: flex;
    align-items: center;
    flex-direction: column;
    overflow-x: auto;
}
</style>
