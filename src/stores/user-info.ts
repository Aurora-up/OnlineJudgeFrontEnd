import { defineStore } from 'pinia'
import { type LoginUserVO, UserControllerService } from '../../apis'
import { MessagePlugin } from 'tdesign-vue-next'

// 用户信息类型
export type UserInfo = {
    userId: number
    userCount: string
    userName: string
    userRole: string
    userAvatar: string
}

export const UserInfoStore = defineStore('userInfo', {
    state: () => {
        return {
            isLogin: <boolean>false,
            loginUserInfo: <UserInfo>{
                userId: 0,
                userCount: '',
                userName: '登录/注册',
                userRole: '',
                userAvatar: ''
            }
        }
    },
    getters: {},
    actions: {
        /* 获取已登录用户的信息 */
        async getLoginUserInfo() {
            await UserControllerService.getLoginUser()
                .then((res) => {
                    // console.log(res)
                    if (res.statusCode != 0) {
                        this.isLogin = false
                        localStorage.setItem('current-login-uid', JSON.stringify(0))
                    } else {
                        this.isLogin = true
                        const loginUserVO: LoginUserVO = res.data ?? {}
                        this.loginUserInfo = {
                            userId: loginUserVO.id,
                            userName: loginUserVO.userName,
                            userAvatar: "http://localhost:3000" + loginUserVO.userAvatar,
                            userRole: loginUserVO.userRole
                        }
                        localStorage.setItem('current-login-uid', JSON.stringify(loginUserVO.id))
                    }
                })
                .catch((err) => {
                    MessagePlugin.error({
                        content: err.message
                    })
                    localStorage.setItem('current-login-uid', JSON.stringify(0))
                })
        }
    }
})
