import {createRouter, createWebHistory} from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeView
        },
        {
            path: '/about',
            name: 'about',
            // route level code-splitting
            // this generates a separate chunk (About.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () => import('../views/AboutView.vue')
        },
        {
            path: '/filter/edit/:id',
            name: 'filter-edit',
            // route level code-splitting
            // this generates a separate chunk (About.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () => import('../views/EditView.vue'),
            props: true,
        },
        {
            path: '/filter/add',
            name: 'filter-add',
            component: () => import('../views/AddView.vue')
        },
        {
            path: '/accessories',
            name: 'accessories',
            component: () => import('../views/AccessoriesView.vue')
        },
        {
            path: '/accessories/add',
            name: 'accessories-add',
            component: () => import('../views/AcAddView.vue')
        },
        {
            path: '/accessories/edit/:id',
            name: 'accessories-edit',
            component: () => import('../views/AcEditView.vue')
        },
        {
            path: '/images',
            name: 'images',
            component: () => import('../views/ImageView.vue')
        },
        {
            path: '/image/edit/:id',
            name: 'image-edit',
            component: () => import('../views/ImageEdit.vue')
        },
        {
            path: '/image/add/',
            name: 'image-add',
            component: () => import('../views/ImageAdd.vue')
        },
        {
            path: '/drones',
            name: 'drones',
            component: () => import('../views/DronesView.vue')
        },
        {
            path: '/drones/edit/:id',
            name: 'drones-edit',
            component: () => import('../views/DronesEditView.vue')
        },
    ]
})

export default router
