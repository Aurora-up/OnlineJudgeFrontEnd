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
import FooterComponent from '@/components/FooterComponent.vue'


</script>

<style scoped>
.content {
  height: 94vh;
  background-color: #ffffff;
  overflow: hidden;
}
</style>