import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import LayoutComponent from '@/components/LayoutComponent.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: "Layout",
    component: LayoutComponent,
    children: [
      {
        path: 'question',
        name: 'Question',
        component: () => import("@/views/QuestionView.vue")
      }
    ]
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
