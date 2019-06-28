import Vue from 'vue';
import Vuex from 'vuex';
import { auth, usersCollection } from '@/firebase';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    currentUser: null,
  },
  mutations: {
    setCurrentUser(state, val) {
      state.currentUser = val;
    },
  },
  actions: {
  },
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
