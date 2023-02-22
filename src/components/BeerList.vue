<template>
  <ul>
    <li v-for="brewery in list" :key="brewery.id" class="brewery">
      <h3 class="brewery-name">
        {{ brewery.name }}
      </h3>

      <ul class="beers">
        <li v-for="beer in brewery.beers" :key="beer.id">
          <Beer :beer="beer" />
        </li>
      </ul>
    </li>
  </ul>
</template>

<script>
import Beer from '@/components/Beer';

export default {
  name: 'BeerList',
  components: { Beer },
  props: {
    list: {
      type: Array,
      default: () => [],
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../styles/abstracts/abstracts';

.brewery {
  border-bottom: 4px solid $c--gray-e;
  position: relative;
}

.brewery-name {
  font-family: 'Rubik Mono One', sans-serif;
  padding: 1em;
  color: $c--gray-4;
  margin-top: 2rem;
  background-color: $c--gray-f;
  position: sticky;
  top: 0;
  z-index: 9;
  box-shadow: 0 4px 4px -4px rgba($c--black, 0.16);
}

.show-starred .beer:not(.saved) {
  display: none;
}
</style>
