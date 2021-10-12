<template>
  <div
    class="door"
    :class="componentClass"
    :style="componentPosition"
  />
</template>

<script>
import component from '../mixins/component';

export default {
  mixins: [component],

  props: {
    openable: {
      type: Boolean,
      default: true,
    },
  },
};
</script>

<style lang="scss" scoped>
  .door {
    background-position: -224px 32px;
  }
</style>
