<template>
  <div class="search">
    <label for="beer-search" class="search-label">Search</label>
    <input
      id="beer-search"
      ref="search"
      type="text"
      placeholder="Start typing to search..."
      @input="handleChange"
    >
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

.search-label {
  @include label;
  display: block;
  margin-bottom: 1em;
}
</style>

