<template>
  <div class="search">
    <label for="beer-search" class="search-label">Search</label>
    <input
      class="search-input"
      id="beer-search"
      ref="search"
      type="search"
      placeholder="Search for a beer or brewery"
      @input="handleChange"
    />
  </div>
</template>

<script>
export default {
  name: 'Search',
  props: {
    onchange: {
      type: Function,
      default: null,
    },
  },
  mounted() {
    this.$refs.search.focus();
  },
  methods: {
    handleChange(event) {
      this.$emit('input', event.target.value);
      if (this.onchange) {
        this.onchange(event.target.value);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../styles/abstracts/abstracts';

.search {
  padding: 1rem;
}

.search-label {
  @include label;
  display: block;
  margin-bottom: 1em;
}

.search-input {
  background-color: $c--white;
  font-size: 1.25rem;
  border: 1px solid $c--gray-e;
}
</style>
