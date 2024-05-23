<template>
    <div class="repository-l-contain">
        <t-card :bordered="false" :shadow="true">
            <div class="repository-content">
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
</template>

<script setup lang="jsx">
import { onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { MessagePlugin } from 'tdesign-vue-next'
import { UserInfoStore } from '@/stores/user-info'
import { ProblemControllerService } from '../../../apis/index'

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
        width: '150',
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
        }
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
        }
    }
])

/* 处理跳转至对应的题目页 */
const router = useRouter()
const handleClickProblemLink = (pid) => {
    router
        .push({
            name: 'ProblemDescription',
            params: {
                PId: pid
            }
        })
        .then(() => {
            window.location.reload()
        })
}

/* 加载题库数据, 传递参数 */
const userInfoStore = UserInfoStore()
const problemRepository = ref({})

onMounted(async () => {
    let repositoryResponse
    // 未登录是默认使用 UID 为 2 的普通用户进行显示
    if (!userInfoStore.$state.isLogin) {
        repositoryResponse = await ProblemControllerService.getAllProblemByUserId(2).catch((e) => {
            MessagePlugin.error({
                content: '服务端出错: ' + e?.message + ' —— ' + e?.name
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
})
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

<style scoped>
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
    width: 100%;
}

.repository-l-contain {
    margin-top: 10px;
    flex: 4;
}

.repository-content {
    width: 100%;
    display: flex;
    align-items: center;
    flex-direction: column;
}
</style>
