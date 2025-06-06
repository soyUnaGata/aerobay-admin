import {createRouter, createWebHashHistory} from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
    history: createWebHashHistory('/aerobay-admin/'),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeView
        },
        {
            path: '/filters',
            name: 'filters',
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
            path: '/drones/add',
            name: 'drones-add',
            component: () => import('../views/DronesAddView.vue')
        },
        {
            path: '/drones/edit/:id',
            name: 'drones-edit',
            component: () => import('../views/DronesEditView.vue')
        },
        {
            path: '/categories',
            name: 'categories',
            component: () => import('../views/CategoryView.vue')
        },
        {
            path: '/groups',
            name: 'groups',
            component: () => import('../views/GroupView.vue')
        },
        {
            path: '/manufactures',
            name: 'manufactures',
            component: () => import('../views/ManufacturerView.vue')
        }
    ]
})

export default router
