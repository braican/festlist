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
        <label for="beer-name">Beer Name</label>
      </div>

      <div class="form-el">
        <BreweryInput :id="'beer-brewery'" v-model="brewery" :required="true" :breweries="breweries" />
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

      <div class="form-el">
        <textarea
          id="beer-notes"
          v-model="notes"
          placeholder="Notes"
        />
        <label for="beer-notes">Notes</label>
      </div>

      <div class="form-el">
        <input
          id="beer-location"
          v-model="location"
          type="text"
          placeholder="Location"
        >
        <label for="beer-location">Table/Booth number</label>
      </div>

      <button type="submit" class="btn form-action">
        Add beer
      </button>
    </form>
  </div>
</template>

<script>
import { festsCollection, stylesCollection  } from '@/firebase';
import { logError } from '@/util/loggers';
import Selectable from '@/components/Selectable';
import BreweryInput from '@/components/BreweryInput';

export default {
  name: 'AddNewBeer',
  components: { Selectable, BreweryInput },
  data() {
    return {
      fests: [],
      styles: [],
      fest: null,
      breweries: [],

      name: '',
      brewery: '',
      style: '',
      abv: '',
      rating: '',
      notes: '',
      location: '',
    };
  },
  firestore() {
    return {
      fests: festsCollection.where('date', '>', new Date()).orderBy('date'),
      styles: stylesCollection.orderBy('name'),
    };
  },
  watch: {
    fest: {
      immediate: true,
      handler(festId) {
        if (festId) {
          this.$bind('breweries', festsCollection.doc(festId).collection('breweries').orderBy('name'));
        }
      },
    },
  },
  created() {
    // Get the first Festival.
    festsCollection.where('date', '>', new Date()).orderBy('date').limit(1).get().then(snapshot => {
      if (snapshot.empty) {
        throw new Error('There are no festivals.');
      }

      // Set the first fest.
      const firstFest = snapshot.docs[0];
      this.fest = firstFest.id;
    }).catch(logError);
  },
  methods: {
    addBeer() {
      const festRef = festsCollection.doc(this.fest);
      const festBeers = festRef.collection('beers');

      // We need to get the brewery first.
      const breweryPromise = new Promise(resolve => {
        const breweryTest = this.breweries.filter(brewery => brewery.name.toLowerCase() === this.brewery.toLowerCase());

        // Add the brewery, since it doesn't exist.
        if (breweryTest.length < 1) {
          festRef.collection('breweries').add({ name: this.brewery }).then(docRef => resolve(docRef.id)).catch(logError);
        } else {
          resolve(breweryTest[0].id);
        }
      });

      breweryPromise.then(breweryId => {
        const beerData = {
          name: this.name,
          style: this.style,
          abv: this.abv,
          rating: this.rating,
          notes: this.notes,
          location: this.location,
          brewery: breweryId,
        };

        festBeers.add(beerData).catch(logError);

        // Clear form.
        this.name = '';
        this.brewery = '';
        this.style = '';
        this.abv = '';
        this.rating = '';
        this.notes = '';
        this.location = '';
      });
    },
  },
};
</script>

