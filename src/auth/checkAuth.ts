import ACCESS_ENUM from '@/auth/AuthEnum'

/**
 * 检查权限（判断当前登录用户是否具有某个权限）
 * @param userRole 当前登录用户的权限
 * @param needAccess 需要有的权限
 * @return boolean 有无权限
 */
const checkAuth = (userRole: string, needAccess = ACCESS_ENUM.NOT_LOGIN) => {
    // 无需登录的页面, 直接放行
    if (needAccess === ACCESS_ENUM.NOT_LOGIN) {
        return true;
    }
    // 需要登录的页面, 但未登录
    if (needAccess !== ACCESS_ENUM.NOT_LOGIN && userRole === ACCESS_ENUM.NOT_LOGIN) {
        return false;
    }
    // 需要管理员权限的页面, 但没有管理员权限
    if (needAccess === ACCESS_ENUM.ADMIN && userRole !== ACCESS_ENUM.ADMIN) {
        return false;
    }
    return true;
};

export default checkAuth;
