import router from "@/router";
import { UserInfoStore } from "@/stores/user-info";
import ACCESS_ENUM from "@/auth/AuthEnum";
import checkAuth from "@/auth/checkAuth";

router.beforeEach(async (to, from, next) => {
    const userInfoStore = UserInfoStore();
    // 1. 用户未登录时, 先去登录 (登录状态保持)
    if(!userInfoStore.isLogin) {
        await userInfoStore.getLoginUserInfo();
    }
    const needAccess = (to.meta?.access as string) ?? ACCESS_ENUM.NOT_LOGIN;



    // let loginUser = store.state.user.loginUser;
    // // // 如果之前没登陆过，自动登录
    // if (!loginUser || !loginUser.userRole) {
    //     // 加 await 是为了等用户登录成功之后，再执行后续的代码
    //     await store.dispatch("user/getLoginUser");
    //     loginUser = store.state.user.loginUser;
    // }
    // const needAccess = (to.meta?.access as string) ?? ACCESS_ENUM.NOT_LOGIN;
    // // 要跳转的页面必须要登陆
    // if (needAccess !== ACCESS_ENUM.NOT_LOGIN) {
    //     // 如果没登陆，跳转到登录页面
    //     if (
    //         !loginUser ||
    //         !loginUser.userRole ||
    //         loginUser.userRole === ACCESS_ENUM.NOT_LOGIN
    //     ) {
    //         next(`/user/login?redirect=${to.fullPath}`);
    //         return;
    //     }
    //     // 如果已经登陆了，但是权限不足，那么跳转到无权限页面
    //     if (!checkAccess(loginUser, needAccess)) {
    //         next("/noAuth");
    //         return;
    //     }
    // }
    next();
});
