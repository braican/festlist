<template>
  <div class="brewery-input">
    <input
      :id="id"
      v-model="breweryName"
      type="text"
      placeholder="Brewery"
      :required="required"
      autocomplete="off"
      @input="onChange"
    >

    <ul v-show="isOpen" class="autocomplete-results">
      <li v-for="brewery in results" :key="brewery.id">
        <button type="button" class="autocomplete-result" @click="setResult(brewery)">
          {{ brewery.name }}
        </button>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'BreweryInput',
  props: {
    id: {
      type: String,
      default: () => '',
    },
    required: {
      type: Boolean,
      default: () => false,
    },
    breweries: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      breweryName: '',
      results: [],
      isOpen: false,
    };
  },
  mounted() {
    document.addEventListener('click', this.handleClickOutside);
  },
  destroyed() {
    document.removeEventListener('click', this.handleClickOutside);
  },
  methods: {
    onChange() {
      this.$emit('input', this.breweryName);
      this.results = this.breweries.filter(brewery => brewery.name.toLowerCase().indexOf(this.breweryName.toLowerCase()) > -1);
      this.isOpen = this.breweryName.length > 1 && this.results.length > 0;
    },
    setResult(result) {
      this.breweryName = result.name;
      this.$emit('input', this.breweryName);
      this.isOpen = false;
    },
    handleClickOutside(evt) {
      if (!this.$el.contains(evt.target)) {
        this.isOpen = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../styles/abstracts/abstracts';

.brewery-input {
  position: relative;
}

.autocomplete-results {
  position: absolute;
  z-index: 2;
  left: 0;
  width: 100%;
  background-color: $c--white;
  box-shadow: 0 2px 4px rgba($c--gray-2, 0.5);
}

.autocomplete-result {
  display: block;
  width: 100%;
  text-align: left;
  padding: 1em;

  &:focus,
  &:hover {
    background-color: lighten($c--teal, 30%);
  }
}

</style>

