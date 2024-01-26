<template>
  <t-head-menu v-model="menuValue" theme="light" @change="changeHandler" style="width: 100vw">
    <template #logo>
      <img height="40" src="../assets/logo.png" alt="logo" />
    </template>

    <t-menu-item value="item1" @click="toQuestion"> 题库</t-menu-item>

    <div class="user-info" @click="toUserInfo">
      <img src="../assets/user.jpg" class="user-img" alt="H" />
    </div>
  </t-head-menu>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const menuValue = ref('')

const changeHandler = (active) => {
  console.log('change', active)
}

const router = useRouter()
const toQuestion = () => {
  router.push({
    name: 'Question'
  })
}
const toUserInfo = () => {
  router.push({
    name: 'UserInfo'
  })
}
</script>

<style lang="less" scoped>
.t-menu__operations {
  .t-button {
    margin-left: 8px;
  }
}

.t-demo-menu--dark {
  .t-button {
    color: #fff;

    &:hover {
      background-color: #4b4b4b;
      border-color: transparent;
      --ripple-color: #383838;
    }
  }
}

.user-info {
  border-radius: 50%;
  width: 40px;
  height: 40px;
}

.user-img {
  width: 40px;
  height: 40px;
  cursor: pointer;
}
</style>
