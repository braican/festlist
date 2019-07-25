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
  position: relative;
  margin-top: 2rem;
  padding-top: 1rem;

  &:after {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: 3rem;
    height: 4px;
    background-color: $c--gray-e;
  }
}

.brewery-name {
  @include label($fs--xs);
}

.beers > li {
  margin-left: -$side-margin;
  margin-right: -$side-margin;
}

.show-starred .beer:not(.saved) {
  display: none;
}

</style>


