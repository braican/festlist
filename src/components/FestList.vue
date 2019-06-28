<template>
  <section class="fest-list">
    <h2>Fest List</h2>
    <nav class="list">
      <ul>
        <li v-for="fest in fests" :key="fest.id">
          {{ fest.name }}
        </li>
      </ul>
    </nav>
  </section>
</template>

<script>
import { festsCollection } from '@/firebase';

export default {
  name: 'FestList',
  data: () => ({
    fests: [],
  }),
  firestore: () => ({
    fests: festsCollection,
  }),
};
</script>

<style lang="scss" scoped>
@import '../styles/abstracts/abstracts';

.list {
  margin-top: 1rem;
}

</style>

