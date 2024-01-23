<template>
  <div>
    <t-layout>

      <t-header>
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

<style scoped>
.content {
  height: 93vh;
  background-color: #ffffff;
  overflow: hidden;
}
</style>