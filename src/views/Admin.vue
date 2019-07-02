<template>
  <div class="app-wrap admin">
    <section class="admin-section">
      <AddNewBeer />
    </section>
    <section class="admin-section">
      <AddNewStyle />
    </section>
  </div>
</template>

<script>
import AddNewBeer from '@/components/AddNewBeer';
import AddNewStyle from '@/components/AddNewStyle';

export default {
  name: 'Admin',
  components: { AddNewBeer, AddNewStyle },
};
</script>

<style lang="scss" scoped>
.admin-section {
  + .admin-section {
    margin-top: 4rem;
  }
}
</style>



