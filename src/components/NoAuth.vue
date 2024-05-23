<template>
    <div
        style="
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            height: 100vh;
        "
    >
        <LogoComponent></LogoComponent>
        <div>
            <span>—— 您没有权限! ! !</span>
            <t-button theme="primary" style="margin-left: 20px" @click="toHome">
                返回 AuroraOJ 主页
            </t-button>
        </div>
        <div style="flex: 2; padding-top: 100px">
            <img
                src="../assets/status/Forbidden.webp"
                alt="NoAuth"
                style="height: 400px; width: 700px"
            />
        </div>
        <footer-component></footer-component>
    </div>
</template>

<script setup lang="ts">
import FooterComponent from '@/components/FooterComponent.vue'
import LogoComponent from '@/components/LogoComponent.vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const toHome = () => {
    router.replace({
        name: 'Repository'
    })
}
</script>

<style scoped></style>
