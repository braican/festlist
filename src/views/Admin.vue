<template>
  <div class="app-wrap admin">
    <AppUtility />
    <section class="admin-section">
      <AddNewBeer />
    </section>
    <section class="admin-section">
      <AddNewStyle />
    </section>
  </div>
</template>

<script>
import AppUtility from '@/components/AppUtility';
import AddNewBeer from '@/components/AddNewBeer';
import AddNewStyle from '@/components/AddNewStyle';

export default {
  name: 'Admin',
  components: { AppUtility, AddNewBeer, AddNewStyle },
};
</script>

<style lang="scss" scoped>
.admin-section {
  + .admin-section {
    margin-top: 4rem;
  }
}
</style>



