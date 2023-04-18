import { createRouter, createWebHistory } from 'vue-router'
import mainPage from '@/pages/index'
import loginPage from '@/pages/login'

const routes = [{
    path: "/",
    redirect: '/mainPage',
    meta: { title: '首页' }
},
{
    path: "/mainPage",
    component: mainPage,
    meta: { title: '首页' }
},
{
    path: "/login",
    component: loginPage,
    meta: { title: '登录' }
}
]
const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes: routes
})
export default router