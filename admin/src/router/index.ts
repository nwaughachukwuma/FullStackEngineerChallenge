import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import store from '@/store';

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      layout: 'backend-layout',
      requiresAuth: true
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import(/* webpackChunkName: "login" */ '../views/Login.vue'),
    meta: {
      layout: 'simple-layout',
    }
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/todo',
    name: 'Todo',
    component: () => import(/* webpackChunkName: "about" */ '../views/Todo.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/logout',
    name: 'Logout',

    component: () => import(/* webpackChunkName: "login" */ '../views/Logout.vue'),
    meta: {
      layout: 'simple-layout'
    }
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

router.beforeEach((to, _from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (store.getters['auth/isLoggedIn']()) {
      next();
    } else {
      next('/login');
    }
  } else {
    next();
  }
});

export default router
