<template>
  <div class="app-utility">
    <nav>
      <ul class="util-menu">
        <li class="beer-list">
          <router-link tag="button" :to="activeFest === null ? '/' : `/fest/${activeFest}`">
            <span class="icon"><BottleIcon /></span>
            <span class="label">Beer List</span>
          </router-link>
        </li>
        <li class="user-control">
          <button v-if="currentUser" class="user-data" @click="showProfileMenu">
            <Avatar />
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
import Profile from '@/components/Profile';
import Avatar from '@/components/Avatar';
import BottleIcon from '@/svg/bottle';
import UserIcon from '@/svg/user';

export default {
  name: 'AppUtility',
  components: { Profile, Avatar, BottleIcon, UserIcon },
  data: () => ({
    profileVisible: false,
  }),
  computed: {
    ...mapState(['currentUser', 'activeFest']),
  },
  methods: {
    login() {
      auth.signInWithPopup(authProvider).catch(err => console.error(err));
    },
    showProfileMenu() {
      this.$store.commit('setProfileVisible', true);
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
}

.icon {
  display: block;
  height: 32px;

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
      background-color: $c--gray-e;
      outline: none;
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

</style>

