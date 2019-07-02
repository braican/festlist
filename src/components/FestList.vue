<template>
  <section class="fest-list">
    <h2>Fest List</h2>
    <nav class="list">
      <ul>
        <li v-for="fest in fests" :key="fest.id">
          <router-link :to="`/fest/${fest.id}`" @click.native="setActiveFest(fest.id)">
            {{ fest.name }}
          </router-link>
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
  methods: {
    setActiveFest(festId) {
      localStorage.setItem('activeFest', festId);
      this.$store.commit('setActveFest', festId);
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../styles/abstracts/abstracts';

.list {
  margin-top: 1rem;
}

</style>

