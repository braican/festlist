<template>
  <header class="app-header">
    <button @click="logout">
      Sign out
    </button>
  </header>
</template>

<script>
import { auth } from '@/firebase';
import { mapState } from 'vuex';

export default {
  name: 'AppHeader',
  computed: {
    ...mapState(['currentUser']),
  },
  methods: {
    logout() {
      auth.signOut().then(() => {
        this.$router.replace('login');
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../styles/abstracts/abstracts';

</style>

