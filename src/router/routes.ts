import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        component: () => import('layouts/MainLayout.vue'),
        children: [
            { path: '/main', component: () => import('pages/IndexPage.vue') },
            { path: '/task', component: () => import('pages/TaskPage.vue'), meta: { needAuth: true } },
            { path: '/login', component: () => import('pages/LoginPage.vue') },
            { path: '/registration', component: () => import('pages/RegistrationPage.vue') },
        ],
    },
    // Always leave this as last one,
    // but you can also remove it
    {
        path: '/:catchAll(.*)*',
        component: () => import('pages/ErrorNotFound.vue'),
    },
];

export default routes;
