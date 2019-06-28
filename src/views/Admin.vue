<template>
  <div class="admin">
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
      <button type="submit">
        Add beer
      </button>
    </form>
  </div>
</template>

<script>
export default {
  name: 'Admin',
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

