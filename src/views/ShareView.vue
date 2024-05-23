<template>
    <div class="qDetails">
        <el-skeleton :loading="problemLoading" animated>
            <template #template>
                <div>
                    <el-skeleton-item variant="h1" class="skPTitle" />
                </div>
                <div style="margin-bottom: 15px">
                    <el-skeleton-item variant="p" class="skPMeta" />
                    <el-skeleton-item variant="p" class="skPMeta" />
                    <el-skeleton-item variant="p" class="skPMeta" />
                    <el-skeleton-item variant="p" class="skPMeta" />
                </div>
                <div style="margin-bottom: 15px">
                    <el-skeleton-item variant="p" class="skPDetails" />
                    <el-skeleton-item variant="p" class="skPDetails" />
                    <el-skeleton-item variant="p" class="skPDetails" />
                    <el-skeleton-item variant="p" class="skPDetails" />
                    <el-skeleton-item variant="p" class="skPDetailsTail" />
                </div>

                <div style="margin-bottom: 15px">
                    <el-skeleton-item variant="p" class="skPDetailsBegin" />
                    <el-skeleton-item variant="p" class="skPDetails" />
                    <el-skeleton-item variant="p" class="skPDetailsTail" />
                </div>

                <div style="margin-bottom: 15px">
                    <el-skeleton-item variant="p" class="skPDetailsBegin" />
                    <el-skeleton-item variant="p" class="skPDetails" />
                    <el-skeleton-item variant="p" class="skPDetailsTail" />
                </div>

                <div style="margin-bottom: 15px">
                    <el-skeleton-item variant="p" class="skPDetails" />
                    <el-skeleton-item variant="p" class="skPDetails" />
                </div>

                <div style="margin-bottom: 15px">
                    <el-skeleton-item variant="p" class="skPFooter" />
                </div>
            </template>
            <template #default>
                <ProblemDetails></ProblemDetails>
            </template>
        </el-skeleton>
    </div>
</template>

<script setup lang="ts">
import { getCurrentInstance, ref } from "vue";
import ProblemDetails from '@/components/leftpane/ProblemDetails.vue'
const problemLoading = ref<boolean>(true);
const currentComponentInstance = getCurrentInstance()
// currentComponentInstance?.proxy?.$Bus.on('problem-details-loading', (isLoading: any) => {
//     loading.value = isLoading
// })
</script>

<style scoped>
.skPTitle {
    width: 40%;
    height: 30px;
    margin-bottom: 10px;
    margin-top: 10px;
}
.skPMeta {
    width: 15%;
    height: 15px;
    margin-right: 15px;
}
.skPDetails {
    height: 20px;
    width: 80%;
    margin-bottom: 5px;
}
.skPDetailsBegin {
    height: 20px;
    width: 30%;
    margin-bottom: 5px;
}
.skPDetailsTail {
    height: 20px;
    width: 50%;
    margin-bottom: 5px;
}
.skPFooter {
    height: 17px;
    width: 70%;
}
.qDetails {
    overflow: auto;
    height: 90vh;
    width: auto;
}
.skContainer {
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
