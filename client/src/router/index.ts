import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import store from '@/store';

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
    meta: {
      layout: 'backend-layout',
      requiresAuth: true
    }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "login" */ '../views/Login.vue'),
    meta: {
      layout: 'simple-layout',
    }
  },
  {
    path: '/about',
    name: 'about',
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
    name: 'todo',
    component: () => import(/* webpackChunkName: "about" */ '../views/Todo.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/logout',
    name: 'logout',

    component: () => import(/* webpackChunkName: "login" */ '../views/Logout.vue'),
    meta: {
      layout: 'simple-layout'
    }
  },
  // employee routes
  {
    path: '/employees',
    name: 'employees',
    component: () => import(/* webpackChunkName: "employees" */ '../views/Admin/EmployeeList.vue'),
    meta: {
      layout: 'backend-layout',
      requiresAuth: true
    }
  },
  {
    path: '/employee/new',
    name: 'employee-new',
    component: () => import(/* webpackChunkName: "employees-new" */ '../views/Admin/UserForm.vue'),
    meta: {
      layout: 'backend-layout',
      requiresAuth: true
    }
  },
  {
    path: '/employee/:id',
    name: 'employee-edit',
    component: () => import(/* webpackChunkName: "employees" */ '../views/Admin/UserForm.vue'),
    meta: {
      layout: 'backend-layout',
      requiresAuth: true
    }
  },
  // performance review route
  {
    path: '/performance-reviews',
    name: 'performance-reviews',
    component: () => import(/* webpackChunkName: "employees" */ '../views/Admin/PerformanceReviewList.vue'),
    meta: {
      layout: 'backend-layout',
      requiresAuth: true
    }
  },
  {
    path: '/performance-review/new',
    name: 'performance-review-new',
    component: () => import(/* webpackChunkName: "performance-review-new" */ '../views/Admin/PerformanceReviewForm.vue'),
    meta: {
      layout: 'backend-layout',
      requiresAuth: true
    }
  },
  {
    path: '/performance-review/:id',
    name: 'performance-review-edit',
    component: () => import(/* webpackChunkName: "performance-review-new" */ '../views/Admin/PerformanceReviewForm.vue'),
    meta: {
      layout: 'backend-layout',
      requiresAuth: true
    }
  },
  {
    path: '/performance-review/details/:id',
    name: 'performance-review-details',
    component: () => import(/* webpackChunkName: "performance-review-new" */ '../views/Admin/PerformanceReviewDetails.vue'),
    meta: {
      layout: 'backend-layout',
      requiresAuth: true
    }
  },
  {
    path: '/performance-review/feedback/assigned',
    name: 'performance-review-feedback-assigned',
    component: () => import(/* webpackChunkName: "performance-review-feedback-pending" */ '../views/Employee/AssignedReviewList.vue'),
    meta: {
      layout: 'backend-layout',
      requiresAuth: true
    }
  },
  {
    path: '/performance-review/feedback/pending',
    name: 'performance-review-feedback-pending',
    component: () => import(/* webpackChunkName: "performance-review-feedback-pending" */ '../views/Employee/PendingReviewList.vue'),
    meta: {
      layout: 'backend-layout',
      requiresAuth: true
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
