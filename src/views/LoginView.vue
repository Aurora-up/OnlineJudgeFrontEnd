<template>
    <div id="login-bc">
        <div class="logo-style">
            <img src="../assets/logo1.png" alt="" style="height: 120px; width: 120px" />
            <img src="../assets/logo2.png" alt="" style="height: 30px; width: 180px" />
        </div>

        <t-card
            :bordered="false"
            :shadow="true"
            :style="{ width: '400px', height: '530px', zIndex: '1' }"
        >
            <t-space direction="vertical" size="15px">
                <div style="margin-left: 5px; margin-top: 70px; display: flex">
                    <LoginIcon size="22px" style="padding-top: 18px" />
                    <h2>&nbsp;登录</h2>
                </div>
                <t-input-adornment prepend="账 号">
                    <t-input
                        class="input-style"
                        placeholder="请输入账号"
                        :clearable="true"
                        size="large"
                        v-model="userCountValue"
                        :tips="userNameTip"
                        :status="userNameInputState"
                        @blur="checkUsername1"
                        @change="checkUsername2"
                    />
                </t-input-adornment>
                <div style="height: 2px"></div>
                <t-input-adornment prepend="密 码">
                    <t-input
                        class="input-style"
                        placeholder="请输入密码"
                        :clearable="true"
                        type="password"
                        size="large"
                        v-model="passwordValue"
                        :tips="passwordTip"
                        :status="passwordInputState"
                        @blur="checkPassword1"
                        @change="checkPassword2"
                    />
                </t-input-adornment>

                <div class="sideInfo">
                    <t-checkbox>记住登录</t-checkbox>
                    <t-link
                        theme="primary"
                        underline
                        href="https://tdesign.tencent.com/"
                        target="_self"
                    >
                        忘记密码?
                    </t-link>
                </div>
                <div></div>
                <t-button block theme="primary" variant="base" @click="checkLogin">登录</t-button>
            </t-space>
            <t-divider>or</t-divider>
            <t-button theme="default" block @click="toReg">注册</t-button>
        </t-card>
        <div class="footer_display">
            @{{ year + '-' + month + '-' + day }} | 侯栋栋 | Aurora Online Judge
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { MessagePlugin } from 'tdesign-vue-next'
import { LoginIcon } from 'tdesign-icons-vue-next'
import { useRouter } from 'vue-router'
import { UserInfoStore } from '@/stores/user-info'
import { type LoginUserVO, UserControllerService } from '../../apis'

const currentDate = new Date()

const year = currentDate.getFullYear()
const month = currentDate.getMonth() + 1 // 月份从0开始，所以需要加1
const day = currentDate.getDate()

const userCountValue = ref<string>('')
const userNameTip = ref<string>('')
const userNameInputState = ref<string>('default')

// 账号输入框失去焦点时触发, 提示用户
const checkUsername1 = () => {
    if (userCountValue.value == '') {
        userNameInputState.value = 'error'
        userNameTip.value = '账号为空'
    }
}
// 账号输入框输入时触发, 提示用户
const checkUsername2 = () => {
    if (userCountValue.value != '') {
        userNameInputState.value = 'default'
        userNameTip.value = ''
    }
}

const passwordValue = ref<string>('')
const passwordTip = ref<string>('')
const passwordInputState = ref<string>('default')
const checkPassword1 = () => {
    if (passwordValue.value == '') {
        passwordInputState.value = 'error'
        passwordTip.value = '密码为空'
    }
}

const checkPassword2 = () => {
    if (passwordValue.value != '') {
        passwordInputState.value = 'default'
        passwordTip.value = ''
    }
}

const router = useRouter()
const store = UserInfoStore()

// 校验登录
const checkLogin = async () => {
    // 1. 账号或密码为空
    if (userCountValue.value == '' || passwordValue.value == '') {
        await MessagePlugin.warning({
            content: '账号或密码为空'
        })
        return
    }
    // 2. 登录
    try {
        const responseLoginUserVO = await UserControllerService.userLogin({}, {
            userAccount: userCountValue.value,
            userPassword: passwordValue.value
        })
        if (responseLoginUserVO.statusCode == 0) {
            store.$state.isLogin = true
            const loginUserInfo: LoginUserVO = responseLoginUserVO.data ?? {};
            store.$state.loginUserInfo = {
                userId: loginUserInfo.id ?? 0,
                userCount: userCountValue.value,
                userName: loginUserInfo.userName ?? "登录/注册",
                userRole: loginUserInfo.userRole ?? "",
                userAvatar: loginUserInfo.userAvatar ?? ""
            }
            await router.push({
                name: 'Repository'
            }).then(() => {
                window.location.reload()
            })
            await MessagePlugin.success({
                content: "登录成功"
            })
        }
        else {
            await MessagePlugin.error({
                content: responseLoginUserVO.description
            })
        }
    } catch (e :any) {
        await MessagePlugin.error({
            content: "服务端出错: " + e?.message + " —— " + e?.name
        })
    }
}

// 去注册
const toReg = () => {
    router.push({
        name: 'Register'
    })
}
</script>

<style scoped>
#login-bc {
    height: 100vh;
    width: 100vw;
    padding: 0;
    margin: 0;
    background-color: #f0f0f0;

    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
}

.login-card {
    background-color: white;
    z-index: 1;
    border-radius: 8px;
    height: 530px;
    width: 400px;
}

.input-style {
    width: 295px;
}

.logo-style {
    background-color: #f0f0f0;
    height: 1px;
    z-index: 2;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.sideInfo {
    margin-top: 3px;
    display: flex;
    justify-content: space-between;
}
.footer_display {
    margin-top: 100px;
    color: #999999;
}
</style>
