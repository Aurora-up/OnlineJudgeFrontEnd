<template>
    <div>
        <t-layout>
            <t-header id="header">
                <NavComponent></NavComponent>
            </t-header>

            <t-content class="content">
                <router-view></router-view>
            </t-content>
        </t-layout>
    </div>
</template>

<script setup lang="ts">
import NavComponent from '@/components/NavComponent.vue'
</script>

<style>
.content {
    height: 96vh;
    background-color: #ffffff;
    overflow: hidden;
}
#header {
    height: 44px;
    border-bottom: 1px solid #EBEBEB;
}
</style>
