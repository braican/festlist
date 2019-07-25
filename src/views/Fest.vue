<template>
  <div class="app-wrap fest">
    <p v-if="fest.name === ''">
      Loading...
    </p>
    <header v-if="fest.name !== ''">
      <h2>{{ fest.name }}</h2>
      <!-- <router-link to="/" class="back-btn">
        <BackArrowIcon />
        <span class="label">Other fests</span>
      </router-link> -->
    </header>

    <p v-show="!currentUser" class="anonymous-message">
      Log in to save and rate your beers.
    </p>

    <Search v-if="searching" v-model="searchTerm" :onchange="handleSearch" />

    <div v-if="searchTerm !== ''">
      <BeerList v-if="searchTerm.length > 2" :list="beerlistSearch" />

      <p v-else class="interstitial-search-message">
        Searching...
      </p>
    </div>

    <div v-if="searchTerm === ''" ref="mainlist" class="beerlist" :class="{'show-starred': starred}">
      <BeerList :list="beerlist" />
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
    };
  },
  firestore() {
    return {
      fest: festsCollection.doc(this.$route.params.id),
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
    ...mapState(['currentUser', 'searching', 'starred']),
  },
  watch: {
    searching(val) {
      if (!val) {
        this.searchTerm = '';
      }
    },
    starred(val) {
      const breweries = this.$refs.mainlist.querySelectorAll('.brewery');

      if (val) {
        breweries.forEach(brewery => {
          const savedBeers = brewery.querySelectorAll('.beer.saved');

          if (savedBeers.length === 0) {
            brewery.classList.add('hide');
          }
        });
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

.search {
  margin-top: 2rem;
}

.interstitial-search-message {
  margin-top: 1rem;
}

.beerlist {
  margin-top: 2rem;
}

</style>

<style>
.brewery.hide {
  display: none;
}

</style>



