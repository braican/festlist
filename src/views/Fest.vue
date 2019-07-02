<template>
  <div class="app-wrap fest">
    <h2>Portland Craft Beer Fest</h2>
    <router-link to="/" class="back-btn">
      <BackArrowIcon />
      <span class="label">Other fests</span>
    </router-link>
  </div>
</template>

<script>
import BackArrowIcon from '@/svg/back-arrow';

export default {
  name: 'Fest',
  components: { BackArrowIcon },
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

</style>


