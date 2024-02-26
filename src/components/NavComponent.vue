<template>
  <div class="menu-er-contain">
    <div style="width: 70%">
      <t-head-menu v-model="menuValue" theme="light" @change="changeHandler" class="t-head-menu">
        <template #logo>
          <img height="40" src="../assets/logo.png" alt="logo" />
        </template>
        <t-menu-item value="problem" @click="toMenuItem('Repository')"> 题库</t-menu-item>
        <t-menu-item value="share" @click="toMenuItem('Share')"> 分享</t-menu-item>
        <t-menu-item value="ai" @click="toMenuItem"> AI</t-menu-item>
        <t-menu-item value="create-problem" @click="toMenuItem('CreateProblem')"> 创建题目</t-menu-item>
        <template #operations>
          <div class="user-info" @click="toMenuItem('UserInfo')">
            <img src="../assets/user.jpg" class="user-img" alt="H" />
          </div>
        </template>
      </t-head-menu>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const menuValue = ref('problem')

const changeHandler = (active:any) => {
  console.log('change', active)
}

const router = useRouter()
const route = useRoute()
const toMenuItem = (routerName: string) => {
  router.push({
    name: routerName
  })
}
// 刷新后保持菜单栏状态
onMounted(() => {
  menuValue.value = route.path.split('/')[1]
})

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

.menu-er-contain {
  display: flex;
  align-items: center;
  justify-content: center;
}
.user-info {
  border-radius: 50%;
  width: 40px;
  height: 40px;
  margin-right: 30px;
}

.user-img {
  width: 40px;
  height: 40px;
  cursor: pointer;
}

.nav-contain {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
</style>
