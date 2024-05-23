<template>
    <div class="menu-er-contain">
        <div class="menu-in-contain" ref="menuInContain">
            <t-head-menu v-model="menuValue" theme="light" @change="changeHandler" id="t-head-menu" v-show="!isReduceMenu">
                <template #logo>
                    <img height="36" src="../assets/logo.png" alt="logo" />
                </template>
                <t-menu-item value="problem" @click="toMenuItem('Repository')"> 题库</t-menu-item>
                <t-menu-item value="share" @click="toMenuItem('Share')"> 分享</t-menu-item>
                <t-menu-item value="submission" @click="toMenuItem('AllProblemSubmission')">
                    提交记录
                </t-menu-item>
                <t-divider
                    layout="vertical"
                    v-show="store.isLogin && store.loginUserInfo.userRole == 'admin'"
                />
                <t-menu-item
                    value="create-problem"
                    @click="toMenuItem('Admin')"
                    v-show="store.isLogin && store.loginUserInfo.userRole == 'admin'"
                >
                    管理员后台
                </t-menu-item>
                <template #operations>
                    <t-tooltip content="个人信息">
                        <div class="user-info" @click="toMenuItem('UserInfo')" v-show="store.isLogin">
                            <img
                                :src="
                                store.loginUserInfo.userAvatar == ''
                                    ? defaultUserAvatar
                                    : store.loginUserInfo.userAvatar
                            "
                                class="user-img"
                                alt="user-avatar"
                            />
                        </div>
                    </t-tooltip>
                    <t-tooltip content="退出登录">
                        <t-button
                            shape="circle"
                            variant="text"
                            @click="logout"
                            v-show="store.isLogin"
                        >
                            <LogoutIcon />
                        </t-button>
                    </t-tooltip>
                    <div v-show="!store.isLogin">
                        <t-tooltip content="去登录/注册">
                            <t-button theme="default" @click="toLogin('Login')">
                                {{ store.loginUserInfo.userName }}
                            </t-button>
                        </t-tooltip>
                    </div>
                </template>
            </t-head-menu>

            <t-head-menu v-model="menuValue" theme="light" @change="changeHandler" id="t-head-menu" v-show="isReduceMenu" expand-type="popup">
                <template #logo>
                    <img height="36" src="../assets/logo.png" alt="logo" />
                </template>
                <div style="flex: 1"></div>
                <t-submenu value="2" style="margin-right: 10px">
                    <template #title>
                        <t-tooltip content="更多">
                            <MenuUnfoldIcon size="22" />
                        </t-tooltip>
                    </template>
                    <t-menu-item value="problem" @click="toMenuItem('Repository')"> 题库</t-menu-item>
                    <t-menu-item value="share" @click="toMenuItem('Share')"> 分享</t-menu-item>
                    <t-menu-item value="submission" @click="toMenuItem('AllProblemSubmission')">
                        提交记录
                    </t-menu-item>
                    <t-menu-item
                        value="create-problem"
                        @click="toMenuItem('Admin')"
                        v-show="store.isLogin && store.loginUserInfo.userRole == 'admin'"
                    >
                        管理员后台
                    </t-menu-item>
                </t-submenu>

                <template #operations>
                    <t-tooltip content="个人信息">
                        <div class="user-reduce-info" @click="toMenuItem('UserInfo')" v-show="store.isLogin">
                            <img
                                :src="
                                store.loginUserInfo.userAvatar == ''
                                    ? defaultUserAvatar
                                    : store.loginUserInfo.userAvatar
                            "
                                class="user-img"
                                alt="user-avatar"
                            />
                        </div>
                    </t-tooltip>
                    <t-tooltip content="退出登录">
                        <t-button
                            shape="circle"
                            variant="text"
                            @click="logout"
                            v-show="store.isLogin"
                        >
                            <LogoutIcon />
                        </t-button>
                    </t-tooltip>
                    <div v-show="!store.isLogin">
                        <t-tooltip content="去登录/注册">
                            <t-button theme="default" @click="toLogin('Login')">
                                {{ store.loginUserInfo.userName }}
                            </t-button>
                        </t-tooltip>
                    </div>
                </template>

            </t-head-menu>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onBeforeMount, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { type UserInfo, UserInfoStore } from '@/stores/user-info'
import { LogoutIcon, MenuUnfoldIcon } from 'tdesign-icons-vue-next'
import { UserControllerService } from '../../apis'
import { MessagePlugin } from 'tdesign-vue-next'

const menuValue = ref('problem')

const changeHandler = (active: any) => {
}

const router = useRouter()
const route = useRoute()
const toMenuItem = (routerName: string) => {
    router.push({
        name: routerName
    })
}

const toLogin = (routerName: string) => {
    router.replace({
        name: routerName
    })
}
onBeforeMount(async () => {
    /*
     * 页面刷新时, 获取已用户登录信息, 保持登录状态 -- 由于该前端设计中的除登录页以外的所有页面都有导航页
     * 故每一次刷新都会触发导航页的刷新, 确保刷新后登录状态保持登录状态。
     */
    if (!store.$state.isLogin) {
        await store.getLoginUserInfo()
    }
})

// 刷新后保持菜单栏状态
onMounted(async () => {
    if (window.innerWidth <= initialWidth.value) {
        menuInContain.value.style.width = `${window.innerWidth}px`
    } else {
        menuInContain.value.style.width = `${initialWidth.value}px`
    }
    menuValue.value = route.path.split('/')[1]
})

const defaultUserAvatar = 'http://localhost:5173/src/assets/user.jpg'
const store = UserInfoStore()

router.beforeEach(async (to, from, next) => {
    // 权限控制
    if (to.meta?.access == 'admin' && store.loginUserInfo.userRole != 'admin') {
        next('/noAuth')
        return
    }
    next()
})

const menuInContain = ref<HTMLDivElement>()
const initialWidth = ref<number>(880)
const menuMinWidth = ref<number>(660)
const isReduceMenu = ref<boolean>(false)

const handleWindowResize = () => {
    if (window.innerWidth <= initialWidth.value) {
        menuInContain.value.style.width = `${window.innerWidth}px`
    } else {
        menuInContain.value.style.width = `${initialWidth.value}px`
    }
    isReduceMenu.value = window.innerWidth <= menuMinWidth.value;
}
window.addEventListener('resize', handleWindowResize)

// 退出登录
const logout = async () => {
    const responseVoid = await UserControllerService.logoutCurrentLoginUser({})
    if (responseVoid.statusCode == 0) {
        store.$state.isLogin = false
        store.$state.loginUserInfo = {} as UserInfo
        await router.replace({
            name: 'Login'
        })
        await MessagePlugin.success({
            content: '已退出当前账号'
        })
    } else {
        await MessagePlugin.warning({
            content: responseVoid.description ?? '未登录, 无需退出'
        })
    }
}
</script>

<style lang="less" scoped>
#t-demo-menu {
    height: 48px;

    .t-button {
        color: #fff;

        &:hover {
            background-color: #4b4b4b;
            border-color: transparent;
            --ripple-color: #383838;
        }
    }
}

.menu-in-contain {
    z-index: 100;
}

.menu-er-contain {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 44px;
    overflow: hidden;
}

.user-info {
    border-radius: 50%;
    width: 36px;
    height: 36px;
    margin-right: 30px;
}

.user-reduce-info {
    border-radius: 50%;
    width: 36px;
    height: 36px;
    margin-right: 5px;
}

.user-img {
    width: 36px;
    height: 36px;
    cursor: pointer;
    padding-bottom: 30px;
}

.nav-contain {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}
</style>
