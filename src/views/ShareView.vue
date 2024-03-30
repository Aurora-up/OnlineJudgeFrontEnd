<template>
    <t-space direction="vertical" size="large">
        <div class="tdesign-tooltip-placement">
            <t-button variant="outline" @click="tackle">
                {{ isStartSmartTip ? '开启' : '关闭'}}
            </t-button>
        </div>
    </t-space>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { MessagePlugin } from 'tdesign-vue-next'
import type { MessagePluginType } from 'tdesign-vue-next/es/message/plugin'
import { MessageLoadingMethod, type MessageThemeList } from 'tdesign-vue-next/es/message/type'

// { content: '用户表示普通操作信息提示', placement: 'top', theme: "loading" }
const isStartSmartTip = ref<boolean>(false)
const msg = ref<any>(null)
const tipStatus = ref<MessageThemeList>('loading')

watch(isStartSmartTip, (n) => {
    if (n) {
        tipStatus.value = 'success'
    }
    else {
        tipStatus.value = 'error'
    }
})

const tackle = () => {
    if (!isStartSmartTip.value) {
        MessagePlugin(tipStatus.value, "正在开启智能提示")
        setTimeout(() => {
            isStartSmartTip.value = true;
        }, 3000)
    }
};



</script>

<style scoped>
</style>
