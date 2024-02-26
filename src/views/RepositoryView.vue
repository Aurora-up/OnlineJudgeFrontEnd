<template>
  <div class="ex-repository-contain">
    <div class="repository-contain">
      <div class="repository-l-contain">
        <t-card :bordered="false" :shadow="true">
          <div class="repository-content">
            <h1>Aurora Online Judge 题库</h1>

            <t-input placeholder="搜索题目" clearable size="large" style="width: 70%">
              <template #suffixIcon>
                <search-icon :style="{ cursor: 'pointer' }" />
              </template>
            </t-input>

            <t-divider></t-divider>

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
              @row-click="handleRowClick"
            >
            </t-table>
          </div>
        </t-card>
      </div>
      <div class="calendar-contain"><Calendar></Calendar></div>
    </div>

    <FooterComponent></FooterComponent>
  </div>
</template>

<script setup lang="jsx">
import { ref } from 'vue'
import { SearchIcon } from 'tdesign-icons-vue-next';
import { useRouter } from 'vue-router'
import FooterComponent from '@/components/FooterComponent.vue'
import Calendar from '@/components/CalendarComponent.vue'

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
      return(
        <t-link theme="default" hover="underline"> {row.Problem} </t-link>
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

const router = useRouter();


const handleRowClick = (...rows) => {
  console.log(parseInt(rows[0].row.PID))
  router.push({
    name: "ProblemDescription",
    params: {
      PId:rows[0].row.PID
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

.ex-repository-contain {
  width: 100vw;
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
}

</style>
