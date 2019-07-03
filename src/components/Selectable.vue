<template>
  <div>
    <div class="select-wrap">
      <select :id="id" :value="value" @change="$emit('input', $event.target.value)">
        <slot />
      </select>

      <SelectArrowIcon />
    </div>
    <label :for="id">{{ label }}</label>
  </div>
</template>

<script>
import SelectArrowIcon from '@/svg/select-arrow';

export default {
  name: 'Selectable',
  components: { SelectArrowIcon },
  props: {
    id: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      default: () => '',
    },
    value: {
      type: String,
      default: () => '',
    },
  },
};
</script>


<style lang="scss" scoped>
.select-wrap {
  position: relative;

  svg {
    position: absolute;
    width: 20px;
    height: 20px;
    right: 10px;
    top: 50%;
    margin-top: -10px;
    pointer-events: none;
  }
}


</style>

