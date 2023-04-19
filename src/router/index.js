import { createRouter, createWebHistory } from 'vue-router'
import mainPage from '@/pages/mainPage/mainPage'
import loginPage from '@/pages/login/loginPage'
const routes = [{
    path: "/",
    redirect: '/login',
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