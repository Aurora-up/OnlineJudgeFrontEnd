<script setup lang="ts">
import { RouterView } from 'vue-router'
import 'animate.css'

</script>

<template>
  <router-view #default="{route,Component}">
    <transition :enter-active-class="`animate__animated  ${route.meta.transition}`">
      <component :is="Component"></component>
    </transition>
  </router-view>
</template>

<style>
body, html {
  height: 100%;
  margin: 0;
  overflow: hidden;
  background-color: #f0f0f0; /* 页面背景色为浅灰色 */
}
</style>
