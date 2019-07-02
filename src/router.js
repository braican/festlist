import Vue from 'vue';
import Router from 'vue-router';

import firebase from 'firebase/app';
import 'firebase/auth';

import store from './store';

import Dashboard from '@/views/Dashboard';
import Admin from '@/views/Admin';
import Fest from '@/views/Fest';

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
    {
      path: '/admin',
      name: 'Admin',
      component: Admin,
      meta: {
        requiresAdmin: true,
      },
    },
    {
      path: '/fest/:id',
      name: 'Fest',
      component: Fest,
    },
  ],
});

router.beforeEach((to, from, next) => {
  // Close the profile.
  store.commit('setProfileVisible', false);

  // Set up the transition.
  const toDepth = to.path.split('/').length;
  const fromDepth = from.path.split('/').length;
  const transitionName = toDepth < fromDepth ? 'slide-right' : 'slide-left';
  store.commit('setTransitionName', transitionName);

  // Lock down auth-only routes.
  const currentUser = firebase.auth().currentUser;
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  if (requiresAuth && !currentUser) {
    next('/');
  } else {
    next();
  }
});

export default router;
