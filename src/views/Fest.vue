<template>
  <div class="fest">
    <p v-if="fest.name === ''" class="loading">
      Loading...
    </p>
    <header v-if="fest.name !== ''" class="header">
      <h2>{{ fest.name }}</h2>
      <!-- <router-link to="/" class="back-btn">
        <BackArrowIcon />
        <span class="label">Other fests</span>
      </router-link> -->
    </header>

    <p v-show="!currentUser" class="anonymous-message">
      Log in to save and rate your beers.
    </p>

    <Search v-if="fest.name !== '' && !starred" v-model="searchTerm" :onchange="handleSearch" />

    <div ref="mainlist">
      <div v-if="searchTerm !== ''" class="beerlist">
        <p v-if="beerlistSearch.length < 1" class="interstitial-search-message">No results</p>
        <BeerList v-else-if="searchTerm.length > 2" :list="beerlistSearch" />
        <p v-else class="interstitial-search-message">
          Searching...
        </p>
      </div>

      <div v-if="searchTerm === ''" class="beerlist" :class="{ 'show-starred': starred }">
        <p v-if="starred && starredCount === 0" class="no-starred-msg">Nothing starred!</p>
        <BeerList :list="beerlist" />
      </div>
    </div>
  </div>
</template>

<script>
import { festsCollection } from '@/firebase';
import { mapState } from 'vuex';
import Search from '@/components/Search';
import BeerList from '@/components/BeerList';
// import BackArrowIcon from '@/svg/back-arrow';

export default {
  name: 'Fest',
  components: { Search, BeerList },
  data() {
    return {
      fest: {
        name: '',
      },

      searchTerm: '',
      beerlistSearch: [],

      // The beers from firestore.
      beers: [],

      // The breweries from firestore.
      breweries: [],

      starredCount: 0,
    };
  },
  firestore() {
    return {
      fest: festsCollection.doc(this.$route.params.id),
      beers: festsCollection.doc(this.$route.params.id).collection('beers'),
      breweries: festsCollection
        .doc(this.$route.params.id)
        .collection('breweries')
        .orderBy('name'),
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
    ...mapState(['currentUser', 'starred']),
  },
  watch: {
    starred(val) {
      if (val) {
        this.searchTerm = '';
        this.beerlistSearch = [];
      }

      const breweries = document.querySelectorAll('.brewery');

      if (val) {
        let starredCount = 0;

        breweries.forEach(brewery => {
          const savedBeers = brewery.querySelectorAll('.beer.saved');

          starredCount += savedBeers.length;

          if (savedBeers.length === 0) {
            brewery.classList.add('hide');
          }
        });

        this.starredCount = starredCount;
      } else {
        breweries.forEach(brewery => brewery.classList.remove('hide'));
      }
    },
  },
  methods: {
    handleSearch(query) {
      query = query.toLowerCase();
      const beerlist = this.beerlist.filter(brewery => {
        const beers = brewery.beers.filter(beer => beer.name.toLowerCase().indexOf(query) > -1);
        return beers.length > 0 || brewery.name.toLowerCase().indexOf(query) > -1;
      });

      this.beerlistSearch = beerlist;
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../styles/abstracts/abstracts';

.loading {
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

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

.header {
  padding: 1rem;
  background-color: $c--yellow-dark;
  color: $c--white;
  text-shadow: 2px 2px rgba($c--black, 0.2);
}

.anonymous-message {
  margin-top: 1rem;
  color: $c--teal;
}

.search {
  margin-top: 2rem;
}

.interstitial-search-message {
  margin-top: 1rem;
  padding-left: 1rem;
  padding-right: 1rem;
}

.beerlist {
  padding: 1rem 0 120px 0;
}

.no-starred-msg {
  padding: 1rem;
}
</style>

<style>
.brewery.hide {
  display: none;
}
</style>
