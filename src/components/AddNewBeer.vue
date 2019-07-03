<template>
  <div class="stack">
    <h2>Add a beer</h2>
    <form class="stack" @submit.prevent="addBeer">
      <div class="form-el">
        <Selectable :id="'beer-fest'" v-model="fest" :label="'Fest'">
          <option v-for="festOption in fests" :key="festOption.id" :value="festOption.id">
            {{ festOption.name }}
          </option>
        </Selectable>
      </div>

      <div class="form-el">
        <input
          id="beer-name"
          v-model="name"
          type="text"
          placeholder="Name"
          required
        >
        <label for="beer-name">Name</label>
      </div>

      <div class="form-el">
        <input
          id="beer-brewery"
          v-model="brewery"
          type="text"
          placeholder="Brewery"
          required
        >
        <label for="beer-brewery">Brewery</label>
      </div>

      <div class="form-el">
        <Selectable :id="'beer-style'" v-model="style" :label="'Style'">
          <option value="">
            Choose a style
          </option>
          <option v-for="styleOption in styles" :key="styleOption.id" :value="styleOption.name">
            {{ styleOption.name }}
          </option>
        </Selectable>
      </div>

      <div class="form-el">
        <input
          id="beer-abv"
          v-model="abv"
          type="number"
          placeholder="ABV"
          min="0"
          step=".01"
        >
        <label for="beer-abv">ABV</label>
      </div>
      <div class="form-el">
        <input
          id="beer-rating"
          v-model="rating"
          type="number"
          placeholder="Rating"
          min="0"
          max="5"
          step=".01"
        >
        <label for="beer-rating">Rating</label>
      </div>
      <button type="submit" class="btn form-action">
        Add beer
      </button>
    </form>
  </div>
</template>

<script>
import { festsCollection, beersCollection, breweriesCollection, stylesCollection  } from '@/firebase';
import Selectable from '@/components/Selectable';

export default {
  name: 'AddNewBeer',
  components: { Selectable },
  data() {
    return {
      fests: [],
      breweries: [],
      styles: [],
      fest: null,
      name: '',
      brewery: '',
      style: '',
      abv: '',
      rating: '',
    };
  },
  firestore() {
    return {
      fests: festsCollection,
      breweries: breweriesCollection,
      styles: stylesCollection,
    };
  },
  created() {
    festsCollection.limit(1).get().then(snapshot => {
      if (snapshot.empty) {
        return;
      }

      const firstFest = snapshot.docs[0];
      this.fest = firstFest.id;
    });
  },
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

