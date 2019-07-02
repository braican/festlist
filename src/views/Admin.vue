<template>
  <div class="app-wrap admin">
    <AppUtility />

    <form @submit.prevent="addBeer">
      <h2>Add a beer</h2>
      <input v-model="name" type="text" placeholder="Name" required>
      <input v-model="brewery" type="text" placeholder="Brewery" required>
      <input v-model="style" type="text" placeholder="Style">
      <input
        v-model="abv"
        type="number"
        placeholder="ABV"
        min="0"
        step=".01"
      >
      <input
        v-model="rating"
        type="number"
        placeholder="Rating"
        min="0"
        max="5"
        step=".01"
      >
      <button type="submit" class="btn add-beer-btn">
        Add beer
      </button>
    </form>
  </div>
</template>

<script>
import AppUtility from '@/components/AppUtility';

export default {
  name: 'Admin',
  components: { AppUtility },
  data() {
    return {
      name: '',
      brewery: '',
      style: '',
      abv: '',
      rating: '',
    };
  },
  methods: {
    addRecipe() {
      const createdAt = new Date();

      this.name = '';
      this.brewery = '';
      this.style = '';
      this.abv = '';
      this.rating = '';
    },
  },
};
</script>

<style lang="scss" scoped>

input {
  margin-top: 1em;
}

.add-beer-btn {
  margin-top: 1em;
}

</style>


