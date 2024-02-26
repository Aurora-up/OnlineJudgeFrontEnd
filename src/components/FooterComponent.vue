<template>
  <div class="footer_display">
    <div>
      @{{ year + '-' + month + '-' + day }}
      <t-divider layout="vertical" />
      版权所有:
      <t-link
        theme="default"
        underline
        style="color: #999999"
        href="https://aurora-up.gitee.io/aurora-blog/"
      >
        侯栋栋
      </t-link>
      <t-divider layout="vertical" />
      Aurora Online Judge
    </div>
  </div>
</template>
<script setup lang="ts">
const currentDate = new Date()

const year = currentDate.getFullYear()
const month = currentDate.getMonth() + 1 // 月份从0开始，所以需要加1
const day = currentDate.getDate()
</script>

<style scoped>
.footer_display {
  margin-top: 10px;
  color: #999999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-bottom: 10px;
}
</style>
