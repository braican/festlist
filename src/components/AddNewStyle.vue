<template>
  <div class="stack">
    <h2>Add a style</h2>
    <h6 @click="toggleShowStyles">
      Current styles
    </h6>
    <ul v-show="stylesVisible">
      <li v-for="style in styles" :key="style.id">
        {{ style.name }}
      </li>
    </ul>
    <form class="stack" @submit.prevent="addStyle">
      <div class="form-el">
        <input v-model="name" type="text" placeholder="Name" required>
        <label for="">Style name</label>
      </div>
      <button type="submit" class="btn form-action">
        Add style
      </button>
    </form>
  </div>
</template>

<script>
import { stylesCollection, beersCollection } from '@/firebase';

export default {
  name: 'AddNewStyle',
  data: () => ({
    styles: [],
    name: '',
    stylesVisible: false,
  }),
  firestore: () => ({
    styles: stylesCollection,
  }),
  methods: {
    toggleShowStyles() {
      this.stylesVisible = !this.stylesVisible;
    },
    addStyle() {
      stylesCollection.add({
        name: this.name,
      }).catch(err => console.error(err));

      this.name = '';
    },
  },
};
</script>
