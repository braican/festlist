<template>
  <div class="app-wrap fest">
    <h2>Portland Craft Beer Fest</h2>
    <!-- <router-link to="/" class="back-btn">
      <BackArrowIcon />
      <span class="label">Other fests</span>
    </router-link> -->

    <p v-show="!currentUser" class="anonymous-message">
      Log in to save and rate your beers.
    </p>

    <div class="beerlist">
      <ul>
        <li v-for="brewery in beerlist" :key="brewery.id" class="brewery">
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
    </div>
  </div>
</template>

<script>
import { festsCollection } from '@/firebase';
import { mapState } from 'vuex';
import Beer from '@/components/Beer';
import BackArrowIcon from '@/svg/back-arrow';

export default {
  name: 'Fest',
  components: { Beer, BackArrowIcon },
  data() {
    return {
      // The beers from firestore.
      beers: [],

      // The breweries from firestore.
      breweries: [],
    };
  },
  firestore() {
    return {
      beers: festsCollection.doc(this.$route.params.id).collection('beers'),
      breweries: festsCollection.doc(this.$route.params.id).collection('breweries').orderBy('name'),
    };
  },
  computed: {
    beerlist() {
      const beerlist = this.breweries.map(brewery => {
        const beers = this.beers.filter(beer => beer.brewery === brewery.id);
        return {
          beers,
          ...brewery,
        };
      });

      return beerlist;
    },
    ...mapState(['currentUser']),
  },
};
</script>

<style lang="scss" scoped>
@import '../styles/abstracts/abstracts';

.back-btn {
  text-decoration: none;
  color: $c--gray-9;

  svg {
    display: inline-block;
    vertical-align: middle;
    width: 20px;
    fill: $c--gray-9;
  }

  .label {
    @include label();
    vertical-align: middle;
    margin-left: 6px;
  }
}

.anonymous-message {
  margin-top: 1rem;
  color: $c--teal;
}

.beerlist {
  margin-top: 2rem;
}

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

</style>


