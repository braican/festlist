<template>
  <div class="stack">
    <h2>Add a beer</h2>
    <form class="stack" @submit.prevent="addBeer">
      <div class="form-el">
        <input v-model="name" type="text" placeholder="Name" required>
        <label for="">Name</label>
      </div>

      <div class="form-el">
        <input v-model="brewery" type="text" placeholder="Brewery" required>
        <label for="">Brewery</label>
      </div>

      <div class="form-el">
        <select v-model="style">
          <option value="">
            Choose a style
          </option>
          <option v-for="style in styles" :key="style.id" :value="style.name">
            {{ style.name }}
          </option>
        </select>
        <label for="">Style</label>
      </div>

      <div class="form-el">
        <input
          v-model="abv"
          type="number"
          placeholder="ABV"
          min="0"
          step=".01"
        >
        <label for="">ABV</label>
      </div>
      <div class="form-el">
        <input
          v-model="rating"
          type="number"
          placeholder="Rating"
          min="0"
          max="5"
          step=".01"
        >
        <label for="">Rating</label>
      </div>
      <button type="submit" class="btn form-action">
        Add beer
      </button>
    </form>
  </div>
  </form>
  </div>
</template>

<script>
import { breweriesCollection, beersCollection, stylesCollection } from '@/firebase';

export default {
  name: 'AddNewBeer',
  data: () => ({
    breweries: [],
    styles: [],
    name: '',
    brewery: '',
    style: '',
    abv: '',
    rating: '',
  }),
  firestore: () => ({
    breweries: breweriesCollection,
    styles: stylesCollection,
  }),
  methods: {
    addBeer() {
      this.name = '';
      this.brewery = '';
      this.style = '';
      this.abv = '';
      this.rating = '';
    },
  },
};
</script>

