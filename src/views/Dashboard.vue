<template>
  <div class="app-wrap dash">
    <AppUtility />

    <FestList />
  </div>
</template>

<script>
import AppUtility from '@/components/AppUtility';
import FestList from '@/components/FestList';

export default {
  name: 'Dashboard',
  components: { AppUtility, FestList },
};
</script>

<style lang="scss" scoped>
@import '../styles/abstracts/abstracts';

</style>


