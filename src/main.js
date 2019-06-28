import Vue from 'vue';
import { firestorePlugin } from 'vuefire';
import App from './App.vue';
import router from './router';
import store from './store';
import { auth } from '@/firebase';

Vue.use(firestorePlugin);

Vue.config.productionTip = false;

auth.onAuthStateChanged(() => {
  new Vue({
    router,
    store,
    render: h => h(App),
  }).$mount('#app');
});
