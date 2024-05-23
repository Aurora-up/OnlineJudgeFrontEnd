import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import LayoutComponent from '@/components/LayoutComponent.vue'
import LoginView from '@/views/LoginView.vue'
import ProblemView from '@/views/ProblemView.vue'
import RepositoryView from '@/views/RepositoryView.vue'
import CreateProblemSolution from '@/components/solution/CreateProblemSolution.vue'
import AdminNav from '@/components/admin/AdminNav.vue'
import ProblemSolutionDisplay from '@/components/solution/ProblemSolutionDisplay.vue'

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
                path: '/problem/:PId/description',
                name: 'ProblemDescription',
                component: ProblemView
            },
            {
                path: '/problem/:PId/solution',
                name: 'ProblemSolution',
                component: ProblemView
            },
            {
                path: '/problem/:PId/submission',
                name: 'ProblemSubmission',
                component: ProblemView
            },
            {
                path: '/problem/:PId/note',
                name: 'ProblemNote',
                component: ProblemView
            },
            {
                path: '/problem/:PId/post-solution/:PSId',
                name: 'CreateProblemSolution',
                component: CreateProblemSolution
            },
            {
                path: '/problem/:PId/solution-display/:PSId',
                name: 'ProblemSolutionDisplay',
                component: ProblemSolutionDisplay
            },
            {
                path: '/share',
                name: 'Share',
                component: () => import('@/views/ShareView.vue')
            },
            {
                path: '/admin',
                name: 'Admin',
                component: AdminNav,
                meta: {
                  access: "admin"
                },
                children: [
                    {
                        path: 'problem',
                        name: 'AdminProblem',
                        component: () => import('@/components/admin/AdminProblem.vue')
                    },
                    {
                        path: 'submission',
                        name: 'AdminSubmission',
                        component: () => import('@/components/admin/AdminSubmission.vue')
                    },
                    {
                        path: 'user',
                        name: 'AdminUser',
                        component: () => import('@/components/admin/AdminUser.vue')
                    },
                    {
                        path: 'solution',
                        name: 'AdminProblem',
                        component: () => import('@/components/admin/AdminSolution.vue')
                    },
                ]
            },
            {
                path: '/all-submission',
                name: 'AllProblemSubmission',
                component: () => import('@/views/AllProblemSubmission.vue')
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
    },
    {
        path: '/noAuth',
        name: 'NoAuth',
        component: () => import('@/components/NoAuth.vue'),
    }
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
})

export default router
