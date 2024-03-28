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
        Problem: ['A + B', '01 背包', '独木桥', ''][i % 3],
        passRate: ['64.32%', '66.67%', '62.90%', '61.78%', '63.11%', '56.44%'][i % 6],
        time: [2, 3, 1, 4][i % 4],
        Difficulty: [2, 1, 0][i % 3]
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
