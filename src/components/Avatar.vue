<template>
  <figure class="user-avatar" :style="{width: `${size}px`, height: `${size}px`}">
    <img :src="currentUser.picture" :alt="`${currentUser.name} avatar`">
  </figure>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'Avatar',
  props: {
    size: {
      type: Number,
      default: 32,
    },
  },
  computed: {
    ...mapState(['currentUser']),
  },
};
</script>


<style lang="scss" scoped>
.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  overflow: hidden;

  img {
    width: 100%;
    display: block;
  }
}

</style>


