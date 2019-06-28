<template>
  <div class="app-utility">
    <nav>
      <ul class="util-menu">
        <li class="user-control">
          <button v-if="currentUser" class="user-data" @click="showProfileMenu">
            <Avatar />
            <span class="label">Profile</span>
          </button>

          <button v-else @click="login">
            Log in
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

export default {
  name: 'AppUtility',
  components: { Profile, Avatar },
  data: () => ({
    profileVisible: false,
  }),
  computed: {
    ...mapState(['currentUser']),
  },
  methods: {
    login() {
      auth.signInWithPopup(authProvider).then(() => {
        console.log('test');

      }).catch(err => {
        console.error(err);
      });
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

.label {
  @include label();
}

.util-menu {
  display: flex;

  button {
    text-align: center;
    padding: 0.5rem;

    &:focus {
      background-color: $c--gray-e;
      outline: none;
    }
  }

  figure {
    margin: auto;
  }
}

</style>

