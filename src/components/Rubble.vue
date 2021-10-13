<template>
  <div
    class="rubble"
    :class="componentClass"
    :style="componentPosition"
  />
</template>

<script>
import component from '../mixins/component';

export default {
  mixins: [component],

  props: {
    shootable: {
      type: Boolean,
      default: true,
    },
  },
};
</script>

<style lang="scss" scoped>
  .rubble {
    background-position: -160px 32px;
  }
</style>
