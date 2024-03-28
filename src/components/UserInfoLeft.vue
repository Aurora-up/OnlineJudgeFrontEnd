<template>
    <div class="l-info-contain">
        <div>
            <img src="../assets/user.jpg" alt="" style="height: 120px" />
        </div>
        <h2>Aurora</h2>
        <div>
            <t-space :key="index" v-for="(item, index) in userTag" style="margin-left: 10px">
                <t-tag shape="round">{{ item }}</t-tag>
            </t-space>
        </div>
        <t-button block theme="default" style="margin-top: 20px">个人信息</t-button>
        <t-divider></t-divider>
        <RadarChart></RadarChart>
    </div>
</template>

<script setup lang="ts">
import RadarChart from '@/components/charts/RadarChart.vue'
import { ref } from 'vue'

const userTag = ref<string[]>(['全栈', 'rust', 'vue', 'java'])
</script>

<style scoped>
.l-info-contain {
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
    align-items: center;
}
</style>
