<template>
  <div class="dash">
    Festlist
  </div>
</template>

<script>
import { auth, authProvider } from '@/firebase';

export default {
  name: 'Login',
  methods: {
    login() {
      auth.signInWithPopup(authProvider).then(() => {
        this.$router.replace('/recipes');
      }).catch(err => {
        console.error(err);
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../styles/abstracts/abstracts';

</style>


