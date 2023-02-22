import Vue from 'vue';
import { firestorePlugin } from 'vuefire';
import App from './App.vue';
import router from './router';
import store from './store';
import { auth } from '@/firebase';
import './registerServiceWorker';

Vue.use(firestorePlugin);

Vue.config.productionTip = false;

auth.onAuthStateChanged(() => {
  new Vue({
    router,
    store,
    beforeCreate() {
      this.$store.commit('initializeStore');
    },
    render: h => h(App),
  }).$mount('#app');
});
