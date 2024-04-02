<template>
    <div class="hmp-contain">
        <div id="ex-ghDay" class="hmp-main"></div>
        <a class="link mr" href="#" @click="toPre">←</a>
        <a class="link" href="#" @click="toNext">→</a>
        <div style="float: right; font-size: 12px">
            <span style="color: #768390">Less</span>
            <div id="ex-ghDay-legend" style="display: inline-block; margin: 0 4px"></div>
            <span style="color: #768390; font-size: 12px">More</span>
        </div>
    </div>
</template>

<script setup>
import CalHeatmap from 'cal-heatmap'
import 'cal-heatmap/cal-heatmap.css'
import LegendLite from 'cal-heatmap/plugins/LegendLite'
import Tooltip from 'cal-heatmap/plugins/Tooltip'
import CalendarLabel from 'cal-heatmap/plugins/CalendarLabel'
import { hmpData } from '@/module/heat_map_fake_data/data.json'

const cal = new CalHeatmap()

cal.paint(
    {
        data: {
            source: hmpData,
            x: 'date',
            y: (d) => +d['value'],
            groupY: 'max'
        },
        date: { start: new Date('2023-01-01') },
        range: 12,
        scale: {
            color: {
                type: 'threshold',
                range: ['#D1ECCC', '#9FD69C', '#5FAE66', '#166A30'],
                domain: [10, 20, 30]
            }
        },
        domain: {
            type: 'month',
            gutter: 4,
            label: { text: 'MMM', textAlign: 'start', position: 'top' }
        },
        subDomain: { type: 'ghDay', radius: 2, width: 11, height: 11, gutter: 4 },
        itemSelector: '#ex-ghDay'
    },
    [
        [
            Tooltip,
            {
                text: function (date, value, dayjsDate) {
                    if (value) {
                        return dayjsDate.format('YYYY.MM.DD') + ' 你刷了' + value + '道题'
                    } else {
                        return dayjsDate.format('YYYY.MM.DD') + ', 今天没有刷题'
                    }
                }
            }
        ],
        [
            LegendLite,
            {
                includeBlank: true,
                itemSelector: '#ex-ghDay-legend',
                radius: 2,
                width: 11,
                height: 11,
                gutter: 4
            }
        ],
        [
            CalendarLabel,
            {
                width: 30,
                textAlign: 'start',
                text: () => ['', 'Mon', '', 'Wed', '', 'Fri', ''],
                padding: [25, 0, 0, 0]
            }
        ]
    ]
)

const toPre = (e) => {
    e.preventDefault()
    cal.previous(1)
}
const toNext = (e) => {
    e.preventDefault()
    cal.next(1)
}
</script>

<style scoped>
.hmp-contain {
    background-color: white;
    color: black;
    border-radius: 3px;
    padding: 1rem;
    overflow: hidden;
}

.link {
    border-radius: 5px;
    border: none;
    background-color: #eaedf0;
    padding: 3px 15px;
    text-decoration: none;
    color: black;
}

.hmp-main {
    margin-bottom: 15px;
}

.mr {
    margin-right: 10px;
}
</style>
