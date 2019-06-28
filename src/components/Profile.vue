<template>
  <aside class="profile" :class="{'visible': profileVisible}">
    <h2>Profile</h2>

    <button @click="closeProfile">
      Close
    </button>

    <div class="user">
      <Avatar :size="60" />
      <h3>{{ currentUser.name }}</h3>
    </div>

    <nav>
      <ul>
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

export default {
  name: 'Profile',
  components: { Avatar },
  computed: {
    ...mapState(['currentUser', 'profileVisible']),
  },
  methods: {
    logout() {
      auth.signOut().then(() => {
        this.$router.replace('login');
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
  padding: $side-margin;

  &.visible {
    transform: translate3d(0, 0, 0);
  }
}

</style>
