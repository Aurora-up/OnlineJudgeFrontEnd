<template>
  <div>
    <t-head-menu v-model="menuValue" theme="light" @change="changeHandler">

      <template #logo>
        <img height="40" src="../assets/logo.png" alt="logo"  />
      </template>

      <t-menu-item value="item1" @click="toQuestion"> 题库 </t-menu-item>

      <template #operations>
        <t-button variant="text" shape="square">
          <template #icon><t-icon name="search" /></template>
        </t-button>
        <t-button variant="text" shape="square">
          <template #icon><t-icon name="mail" /></template>
        </t-button>
        <t-button variant="text" shape="square">
          <template #icon><t-icon name="user" /></template>
        </t-button>
        <t-button variant="text" shape="square">
          <template #icon><t-icon name="ellipsis" /></template>
        </t-button>
      </template>

    </t-head-menu>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router'

const menuValue = ref('');

const changeHandler = (active) => {
  console.log('change', active);
};

const router = useRouter();
const toQuestion = () => {
  router.push({
    name: "Question"
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
</style>
