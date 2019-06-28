<template>
  <div class="dash">
    <AppUtility />

    <FestList />
  </div>
</template>

<script>
import AppUtility from '@/components/AppUtility';
import FestList from '@/components/FestList';

export default {
  name: 'Login',
  components: { AppUtility, FestList },
};
</script>

<style lang="scss" scoped>
@import '../styles/abstracts/abstracts';

.dash {
  padding: $side-margin;
}

</style>


