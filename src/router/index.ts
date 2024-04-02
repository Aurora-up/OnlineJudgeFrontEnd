import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import LayoutComponent from '@/components/LayoutComponent.vue'
import LoginView from '@/views/LoginView.vue'
import ProblemView from '@/views/ProblemView.vue'
import RepositoryView from '@/views/RepositoryView.vue'

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'Layout',
        component: LayoutComponent,
        redirect: '/problem',
        children: [
            {
                path: '/problem',
                name: 'Repository',
                component: RepositoryView
            },
            {
                path: '/problem/description/:PId',
                name: 'ProblemDescription',
                component: ProblemView
            },
            {
                path: '/problem/solution/:PId',
                name: 'ProblemSolution',
                component: ProblemView
            },
            {
                path: '/problem/submission/:PId',
                name: 'ProblemSubmission',
                component: ProblemView
            },
            {
                path: '/problem/note/:PId',
                name: 'ProblemNote',
                component: ProblemView
            },
            {
                path: '/share',
                name: 'Share',
                component: () => import('@/views/ShareView.vue')
            },
            {
                path: '/create-problem',
                name: 'CreateProblem',
                component: () => import('@/views/CreatProblemView.vue')
            },
            {
                path: '/userinfo',
                name: 'UserInfo',
                component: () => import('@/views/UserInfoView.vue')
            },
        ]
    },
    {
        path: '/login',
        name: 'Login',
        component: LoginView,
        meta: {
            title: '登录界面',
            transition: 'animate__backInLeft'
        }
    },
    {
        path: '/register',
        name: 'Register',
        component: () => import('@/views/RegView.vue'),
        meta: {
            title: '注册界面',
            transition: 'animate__flipInX'
        }
    }
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
})

export default router
