import { createRouter, createWebHashHistory } from 'vue-router'
import mainPage from '@/pages/mainPage/mainPage'
import loginPage from '@/pages/login/loginPage'
const routes = [{
    path: "/",
    redirect: '/mainPage',
    meta: { title: '柴特GPT' }
},
{
    path: "/mainPage",
    component: mainPage,
    meta: { title: '柴特GPT' }
},
{
    path: "/login",
    component: loginPage,
    meta: { title: '登录' }
}
]
const router = createRouter({
    model:'hash',
    history: createWebHashHistory(process.env.BASE_URL),
    routes: routes
})
export default router