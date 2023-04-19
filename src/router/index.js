import { createRouter, createWebHistory } from 'vue-router'
import mainPage from '@/pages/mainPage/mainPage'

const routes = [{
    path: "/",
    redirect: '/mainPage',
    meta: { title: '首页' }
},
{
    path: "/mainPage",
    component: mainPage,
    meta: { title: '首页' }
}
]
const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes: routes
})
export default router