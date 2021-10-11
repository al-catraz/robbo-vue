<template>
  <div
    class="component crate"
    :style="position"
  />
</template>

<script>
import component from '../mixins/component';

export default {
  mixins: [component],

  props: {
    movable: {
      type: Boolean,
      default: true,
    },
  },

  watch: {
    x() {
      this.playSound('move');
    },
    y() {
      this.playSound('move');
    },
  },
};
</script>

<style lang="scss" scoped>
  .crate {
    background: brown;
  }
</style>
