<template>
  <v-chart class="chart" :option="option" />
</template>

<script setup lang="ts">
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { GaugeChart } from 'echarts/charts'
import { TitleComponent, TooltipComponent, LegendComponent } from 'echarts/components'
import VChart from 'vue-echarts'

use([CanvasRenderer, GaugeChart, TitleComponent, TooltipComponent, LegendComponent])

import { ref } from 'vue'

const gaugeData = [
  {
    value: 19,
    name: '困难',
    title: {
      offsetCenter: ['-100%', '122%']
    },
    detail: {
      valueAnimation: true,
      offsetCenter: ['-150%', '122%']
    },
    itemStyle: {
      color: '#EE6666'
    }
  },
  {
    value: 23,
    name: '中等',
    title: {
      offsetCenter: ['20%', '122%']
    },
    detail: {
      valueAnimation: true,
      offsetCenter: ['-30%', '122%']
    },
    itemStyle: {
      color: '#FAC858'
    }
  },
  {
    value: 41,
    name: '简单',
    title: {
      offsetCenter: ['140%', '122%']
    },
    detail: {
      valueAnimation: true,
      offsetCenter: ['90%', '122%']
    },
    itemStyle: {
      color: '#91CC75'
    }
  }
]
const option = ref({
  title: {
    text: '解题数量',
    left: 'left', // 标题居中
    textStyle: {
      fontSize: 18 // 标题字体大小
    }
  },
  tooltip: {
    trigger: 'item'
  },
  series: [
    {
      type: 'gauge',
      startAngle: 90,
      endAngle: -270,
      pointer: {
        show: false
      },
      progress: {
        show: true,
        overlap: false,
        roundCap: true,
        clip: false,
        itemStyle: {
          borderWidth: 1,
          borderColor: '#464646'
        }
      },
      axisLine: {
        lineStyle: {
          width: 25
        }
      },
      splitLine: {
        show: false,
        distance: 0,
        length: 10
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        show: false,
        distance: 50
      },
      data: gaugeData,
      title: {
        fontSize: 14
      },
      detail: {
        width: 20,
        height: 5,
        fontSize: 14,
        color: 'inherit',
        borderColor: 'inherit',
        borderRadius: 20,
        formatter: '{value}道'
      }
    }
  ]
})
</script>

<style scoped>
.chart {
  height: 170px;
}
</style>
