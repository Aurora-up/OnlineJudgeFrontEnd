<template>
    <div class="admin-container">
        <t-layout class="admin-layout">
            <t-aside>
                <t-menu theme="light" default-value="2-1" >
                    <t-menu-item value="item1">
                        <template #icon>
                            <t-icon name="book" />
                        </template>
                        题目管理
                    </t-menu-item>
                    <t-menu-item value="item2">
                        <template #icon>
                            <t-icon name="book-open" />
                        </template>
                        题解管理
                    </t-menu-item>
                    <t-menu-item value="item3">
                        <template #icon>
                            <t-icon name="upload-1" />
                        </template>
                        提交管理
                    </t-menu-item>
                    <t-menu-item value="item4">
                        <template #icon>
                            <t-icon name="usergroup" />
                        </template>
                        用户管理
                    </t-menu-item>
                </t-menu>
            </t-aside>
            <t-layout>
                <t-content>

                </t-content>
                <FooterComponent></FooterComponent>
            </t-layout>
        </t-layout>
    </div>
</template>

<script setup lang="ts">
import FooterComponent from '@/components/FooterComponent.vue'
import { useRouter } from 'vue-router'
import { onBeforeMount } from 'vue'
import { UserInfoStore } from '@/stores/user-info'
const router = useRouter();
const store = UserInfoStore();
onBeforeMount(() => {
    console.log(store.$state.loginUserInfo.userRole)
    if (store.$state.loginUserInfo.userRole != 'admin') {
        router.replace({
            name: "NoAuth"
        })
    }
})

</script>
<style scoped>
.admin-container {
    height: 95.5vh;
    width: 100vw;
}
.admin-layout {
    height: 95.5vh;
}
</style>
