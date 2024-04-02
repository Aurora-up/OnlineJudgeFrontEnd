<template>
    <v-chart class="chart" :option="option" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { RadarChart } from 'echarts/charts'
import { TitleComponent, TooltipComponent, LegendComponent } from 'echarts/components'
import VChart from 'vue-echarts'

use([CanvasRenderer, RadarChart, TitleComponent, TooltipComponent, LegendComponent])

const option = ref({
    title: {
        text: '技能'
    },
    radar: {
        top: '20%',
        // shape: 'circle',
        radius: '55%', // 设置雷达图的大小，可以是百分比或具体数值
        indicator: [
            { name: '数据结构', max: 6500 },
            { name: '算法', max: 16000 },
            { name: '设计', max: 30000 },
            { name: '数理逻辑', max: 38000 },
            { name: '优化', max: 52000 },
            { name: '数据库', max: 25000 }
        ]
    },
    series: [
        {
            name: 'Budget vs spending',
            type: 'radar',
            data: [
                {
                    value: [5000, 14000, 28000, 26000, 42000, 21000],
                    name: 'Actual Spending'
                }
            ]
        }
    ]
})
</script>

<style scoped>
.chart {
    height: 220px;
}
</style>
