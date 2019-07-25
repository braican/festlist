<template>
  <div class="app-utility">
    <nav>
      <ul class="util-menu">
        <li class="beer-list">
          <router-link tag="button" :to="activeFest === null ? '/' : `/fest/${activeFest}`" @click.native="clearAll">
            <span class="icon"><BottleIcon /></span>
            <span class="label">Beer List</span>
          </router-link>
        </li>
        <li class="search">
          <button class="search-btn" :class="{active: searchActive}" @click="toggleSearch">
            <span class="icon"><SearchIcon /></span>
            <span class="label">Search</span>
          </button>
        </li>
        <li class="starred">
          <button class="starred-btn" :class="{active: starredActive}" @click="toggleStarred">
            <span class="icon"><StarIcon /></span>
            <span class="label">Starred</span>
          </button>
        </li>
        <li class="user-control">
          <button v-if="currentUser" class="user-data" @click="showProfileMenu">
            <Avatar :size="24" />
            <span class="label">Profile</span>
          </button>

          <button v-else @click="login">
            <span class="icon"><UserIcon /></span>
            <span class="label">Log in</span>
          </button>
        </li>
      </ul>
    </nav>

    <Profile v-if="currentUser" />
  </div>
</template>

<script>
import { auth, authProvider } from '@/firebase';
import { mapState } from 'vuex';
import { logError } from '@/util/loggers';
import Profile from '@/components/Profile';
import Avatar from '@/components/Avatar';
import BottleIcon from '@/svg/bottle';
import UserIcon from '@/svg/user';
import SearchIcon from '@/svg/search';
import StarIcon from '@/svg/star';

export default {
  name: 'AppUtility',
  components: { Profile, Avatar, BottleIcon, UserIcon, SearchIcon, StarIcon },
  data: () => ({
    profileVisible: false,
    searchActive: false,
    starredActive: false,
  }),
  computed: {
    ...mapState(['currentUser', 'activeFest']),
  },
  methods: {
    login() {
      auth.signInWithPopup(authProvider).catch(logError);
    },
    showProfileMenu() {
      this.$store.commit('setProfileVisible', true);
    },
    clearAll() {
      this.starredActive = false;
      this.$store.commit('setStarred', false);
    },
    toggleSearch() {
      const searchStatus = !this.searchActive;
      this.searchActive = searchStatus;
      this.$store.commit('setSearching', this.searchStatus);
    },
    toggleStarred() {
      const starredStatus = !this.starredActive;
      this.starredActive = starredStatus;
      this.$store.commit('setStarred', this.starredStatus);

    },
  },
};
</script>

<style lang="scss" scoped>
@import '../styles/abstracts/abstracts';

.app-utility {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  box-shadow: 0 -1px 4px rgba($c--black, 0.2);
  background-color: $c--white;
}

.icon {
  display: block;
  height: 24px;

  svg {
    display: block;
    height: 100%;
    margin: auto;
  }
}

.label {
  @include label();
}

.util-menu {
  display: flex;

  button {
    display: block;
    width: 100%;
    text-align: center;
    padding: 0.5rem;

    &:focus {
      outline: none;
    }

    &:not(.active):focus {
      background-color: $c--gray-e;
    }
  }

  li {
    flex: 1;
    border-right: 1px solid $c--gray-e;

    &:last-child {
      border-right: 0;
    }
  }

  figure {
    margin: auto;
  }
}

.router-link-active {
  svg {
    fill: $c--teal;
  }

  .label {
    color: $c--teal;
  }
}

.starred-btn.active,
.search-btn.active {
  background-color: $c--teal-light;
}

</style>

