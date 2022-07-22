import Vue from 'vue';
import Vuex from 'vuex';
import { auth, usersCollection } from '@/firebase';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    // Is the user profile visible?
    profileVisible: false,

    // Holds data for the current user, if there is one.
    currentUser: null,

    // Store the most recently active fest.
    activeFest: null,

    // The global router transition.
    transitionName: 'slide-right',

    // Starred view is active flag.
    starred: false,
  },
  mutations: {
    initializeStore(state) {
      if (localStorage.getItem('activeFest')) {
        state.activeFest = localStorage.getItem('activeFest');
      }
    },
    setProfileVisible(state, val) {
      state.profileVisible = val;
    },
    setCurrentUser(state, val) {
      state.currentUser = val;
    },
    setActveFest(state, val) {
      state.activeFest = val;
    },
    setTransitionName(state, val) {
      state.transitionName = val;
    },
    setStarred(state, val) {
      state.starred = val;
    },
  },
  actions: {},
});

auth.onAuthStateChanged(user => {
  if (user) {
    const userData = {
      name: user.displayName,
      picture: user.photoURL,
      uid: user.uid,
    };

    // Write the user to the db.
    usersCollection.doc(user.uid).set(userData, { merge: true });

    // Then set state.
    store.commit('setCurrentUser', userData);
  }
});

export default store;
