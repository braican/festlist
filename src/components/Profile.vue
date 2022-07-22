<template>
  <aside class="profile" :class="{ visible: profileVisible }">
    <button class="close-profile" @click="closeProfile">
      <BackArrowIcon />
      <span>Close</span>
    </button>

    <div class="user">
      <Avatar :size="60" />
      <h3 class="user-name">
        {{ currentUser.name }}
      </h3>
    </div>

    <nav class="profile-nav">
      <ul>
        <li>
          <router-link to="/admin">
            Add a beer
          </router-link>
        </li>
        <li>
          <button @click="logout">
            Log out
          </button>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<script>
import { auth } from '@/firebase';
import { mapState } from 'vuex';
import Avatar from '@/components/Avatar';
import BackArrowIcon from '@/svg/back-arrow';

export default {
  name: 'Profile',
  components: { Avatar, BackArrowIcon },
  computed: {
    ...mapState(['currentUser', 'profileVisible']),
  },
  methods: {
    logout() {
      auth.signOut().then(() => {
        this.$router.replace('/');
        this.$store.commit('setCurrentUser', null);
      });
    },
    closeProfile() {
      this.$store.commit('setProfileVisible', false);
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../styles/abstracts/abstracts';

.profile {
  @include transition();
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  transform: translate3d(100%, 0, 0);
  background-color: $c--gray-3;
  color: $c--white;

  &.visible {
    transform: translate3d(0, 0, 0);
  }
}

.close-profile {
  position: absolute;
  top: $side-margin;
  right: $side-margin;

  svg {
    width: 32px;
    display: inline-block;
    vertical-align: middle;
    fill: $c--white;
  }

  span {
    @include label();
    vertical-align: middle;
    margin-left: 8px;
  }

  &:focus {
    outline: none;

    svg {
      fill: $c--gray-e;
    }
  }
}

.user {
  margin-bottom: $side-margin;
  background-color: $c--gray-4;
  padding: $side-margin;
}

.user-avatar {
  border: 2px solid $c--white;
}

.user-name {
  margin-top: 0.5em;
  font-weight: $fw--bold;
}

.profile-nav {
  a,
  button {
    color: $c--white;
    text-decoration: none;
    padding: $side-margin;
  }
}
</style>
