import Vue from 'vue';
import Router from 'vue-router';

import firebase from 'firebase/app';
import 'firebase/auth';

import Dashboard from '@/views/Dashboard';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '*',
      redirect: '/',
    },
    {
      path: '/',
      name: 'Dashboard',
      component: Dashboard,
    },
  ],
});

router.beforeEach((to, from, next) => {
  const currentUser = firebase.auth().currentUser;
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  if (requiresAuth && !currentUser) {
    next('/');
  } else {
    next();
  }
});

export default router;