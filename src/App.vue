<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
// Import the global css.
import '@/styles/global.scss';

export default {
  name: 'App',
};
</script>

<style lang="scss" scoped>
#app {
  overflow: hidden;
}
</style>

