<template>
  <v-chart class="chart" :option="option" />
</template>

<script setup>
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { PieChart } from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent
} from "echarts/components";
import VChart from "vue-echarts";
import { ref } from 'vue'

use([
  CanvasRenderer,
  PieChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent
]);

const option = ref({
  title: {
    text: '解题种类',
    left: 'left', // 标题居中
    textStyle: {
      fontSize: 18 // 标题字体大小
    }
  },
  tooltip: {
    trigger: 'item'
  },
  legend: {
    top: '89%',
    left: 'center'
  },
  series: [
    {
      name: '分类',
      type: 'pie',
      top: "1%",
      radius: ['45%', '75%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 10,
        borderColor: '#fff',
        borderWidth: 2
      },
      label: {
        show: false,
        position: 'center'
      },
      emphasis: {
        label: {
          show: true,
          fontSize: 15,
          fontWeight: 'bold'
        }
      },
      labelLine: {
        show: false
      },
      data: [
        { value: 27, name: "模拟" },
        { value: 9, name: "数学" },
        { value: 14, name: "动态规划" },
        { value: 6, name: "贪心" },
        { value: 36, name: "数据结构" }
      ],
    }
  ]
});

</script>

<style scoped>
.chart {
  height: 170px;
}
</style>