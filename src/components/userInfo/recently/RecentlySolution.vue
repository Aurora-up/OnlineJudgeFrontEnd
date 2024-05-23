<template>
    <t-space direction="vertical">
        <!-- 当数据为空需要占位时，会显示 cellEmptyContent -->
        <t-table
            row-key="index"
            :data="data"
            :columns="columns"
            :stripe="true"
            :bordered="false"
            :hover="true"
            table-layout="fixed"
            size="small"
            :pagination="pagination"
            cell-empty-content="-"
            lazy-load
            @row-click="handleRowClick"
        >
        </t-table>
    </t-space>
</template>

<script setup lang="jsx">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const currentQuestionState = {
    0: { label: 'AC', theme: 'success-icon', icon: 'check-circle' },
    1: { label: 'ER', theme: 'danger-icon', icon: 'close-circle' },
    2: { label: 'TO', theme: 'warning-icon', icon: 'close-circle' },
    3: { label: '-', theme: 'default-icon', icon: 'minus-circle' }
}

const currentQuestionDifficult = {
    0: { label: '简单', theme: 'success' },
    1: { label: '中等', theme: 'warning' },
    2: { label: '困难', theme: 'danger' }
}

const data = []
const total = 28
for (let i = 0; i < total; i++) {
    data.push({
        index: i + 1,
        status: 0,
        PID: i + 1,
        Problem: ['A + B', '64位整数乘法', '起床困难综合症', '最短Hamilton','a^b','递归实现排列型枚举','递归实现指数型枚举','费解的开关','组合型枚举','Fractal Streets','Sumdiv','激光炸弹','IncDec Sequence','Tallest Cow','Best Cow Fence','Innovative Business','货仓选址','七夕祭','Cinema','Genius ACM', '国王游戏','Color a Tree', 'Radar Installation','Stall Reservation','Sunscreen'][i % 28],
        passRate: ['64.32%', '66.67%', '62.90%', '61.78%', '63.11%', '56.44%', '43.16%', '41.93%','53.26%','52.11%','54.31%','61.96%','51.12%','44.12%', '41.61%', '42.33%', '46.89%', '47.77%', '43.66%', '51.62%', '53.74%', '44.01%', '54.18%'][i % 28],
        time: [2, 3, 1, 4][i % 4],
        Difficulty: [0, 0, 1, 2, 0, 0, 0, 1, 0, 1, 1, 1, 1, 2, 1, 1, 1, 2][i % 18]
    })
}

const columns = ref([
    {
        colKey: 'status',
        title: '状态',
        cell: (h, { row }) => {
            return (
                <t-icon
                    name={currentQuestionState[row.status].icon}
                    class={currentQuestionState[row.status].theme}
                />
            )
        },
        width: '70'
    },
    { colKey: 'PID', title: '题号', width: '70' },
    {
        colKey: 'Problem',
        title: '题目',
        width: '430',
        cell: (h, { row }) => {
            return (
                <t-link theme="default" hover="underline">
                    {' '}
                    {row.Problem}{' '}
                </t-link>
            )
        }
    },
    { colKey: 'passRate', title: '通过率', ellipsis: true },
    {
        colKey: 'Difficulty',
        title: '难度',
        ellipsis: true,
        cell: (h, { row }) => {
            return (
                <t-tag
                    shape="round"
                    theme={currentQuestionDifficult[row.Difficulty].theme}
                    variant="light-outline"
                >
                    {currentQuestionDifficult[row.Difficulty].label}
                </t-tag>
            )
        }
    }
])

const router = useRouter()

const handleRowClick = (...rows) => {
    router.push({
        name: 'ProblemDescription',
        params: {
            PId: rows[0].row.PID
        }
    })
}

const pagination = {
    defaultCurrent: 1,
    defaultPageSize: 20,
    total
}
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
</style>
