<template>
  <!-- 外层容器 —— 控制底色, 滚动等 -->
  <div class="extra-contain">
    <!--  用户信息容器 —— flex 布局  -->
    <div class="info-contain">
      <!--  左侧用户信息容器    -->
      <div class="left-info-contain mr mt">
        <t-card style="height: 500px;" :bordered="false"
                :hover-shadow="true">
          头像区, 个人信息区
        </t-card>
      </div>

      <!--   右侧用户数据可视化图表容器   -->
      <div class="contribution-contain">
        <div class="contribution-graph mb">
          <!--    刷题种类 —— 饼图     -->
          <div class="pie-graph mr mt">
            <t-card :bordered="false"
                    :hover-shadow="true">
              <PieChart></PieChart>
            </t-card>
          </div>
          <!--    不同难度刷题数量 —— 圆环图      -->
          <div class="chat-graph mr mt">
            <t-card :bordered="false"
                    :hover-shadow="true">
              <RingChart></RingChart>
            </t-card>
          </div>
        </div>

        <!--   每天的刷题数量 —— 热力图    -->
        <div class="heatmap mb mr">
          <t-card :bordered="false"
                  :hover-shadow="true">
            <HeatMap></HeatMap>
          </t-card>
        </div>

        <!--   最近刷的题目和写的题解    -->
        <div class="recent-solution mr">
          <t-card :bordered="false"
                  :hover-shadow="true">
            最近通过题目，题解
          </t-card>
        </div>

      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import PieChart from '@/components/charts/PieChart.vue'
import RingChart from '@/components/charts/RingChart.vue'
import HeatMap from '@/components/charts/HeatMap.vue'


</script>

<style scoped>

.mt {
  margin-top: 10px;
}
.ml {
  margin-left: 10px;
}
.mr {
  margin-right: 10px;
}
.mb {
  margin-bottom: 10px;
}

.extra-contain {
  display: flex;
  justify-content: center;
  width: 100vw;
  height: 100vh;
  background-color: #F0F0F0;
  overflow: auto;
}
.info-contain {
  display: flex;
  flex-wrap: wrap;
  min-width: 70%;
}
.left-info-contain {
  min-width: 300px;
  flex: 1;
  height: 400px;
}
.contribution-contain {
  min-width: 310px;
  display: flex;
  flex: 4;
  flex-direction: column;
}
.contribution-graph {
  min-width: 310px;
  display: flex;
  flex-wrap: wrap;
}
.pie-graph {
  min-width: 300px;
  flex: 1;
}
.chat-graph {
  min-width: 300px;
  flex: 1;
}
.heatmap {
  min-width: 300px;
}
.recent-solution {
  min-width: 300px;
}
</style>