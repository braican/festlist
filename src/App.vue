<template>
  <div id="app">
    <transition :name="transitionName" mode="out-in">
      <router-view />
    </transition>

    <AppUtility />
  </div>
</template>

<script>
// Import the global css.
import '@/styles/global.scss';

import { mapState } from 'vuex';
import AppUtility from '@/components/AppUtility';

export default {
  name: 'App',
  components: { AppUtility },
  computed: {
    ...mapState(['transitionName']),
  },
};
</script>

<style lang="scss" scoped>
@import './styles/abstracts/abstracts';

#app {
  background-color: $c--gray-f;
  min-height: 100vh;
}

// Transitions
// -----------

.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  @include transition();
  transition-property: opacity, transform;
  overflow: hidden;
}

.slide-left-enter,
.slide-right-leave-active {
  opacity: 0;
  transform: translate(2em, 0);
}

.slide-left-leave-active,
.slide-right-enter {
  opacity: 0;
  transform: translate(-2em, 0);
}
</style>
