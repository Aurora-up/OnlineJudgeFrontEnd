import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import LayoutComponent from '@/components/LayoutComponent.vue'
import LoginView from '@/views/LoginView.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: "Layout",
    component: LayoutComponent,
    children: [
      {
        path: 'question',
        name: 'Question',
        component: () => import("@/views/QuestionView.vue"),
      },
      {
        path: 'userinfo',
        name: 'UserInfo',
        component: () => import('@/views/UserInfoView.vue')
      }
    ]
  },
  {
    path: '/login',
    name: "Login",
    component: LoginView,
    meta: {
      title: "登录界面",
      transition: "animate__backInLeft"
    }
  },
  {
    path: '/reg',
    name: "Reg",
    component: () => import('@/views/RegView.vue'),
    meta: {
      title: "注册界面",
      transition: "animate__flipInX"
    }
  },

]


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  // routes: [
  //   {
  //     path: '/',
  //     name: 'home',
  //     component: HomeView
  //   },
  //   {
  //     path: '/about',
  //     name: 'about',
  //     // route level code-splitting
  //     // this generates a separate chunk (About.[hash].js) for this route
  //     // which is lazy-loaded when the route is visited.
  //     component: () => import('../views/AboutView.vue')
  //   }
  // ]
})



export default router
