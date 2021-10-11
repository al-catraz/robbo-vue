<template>
  <div
    class="component key"
    :style="position"
  />
</template>

<script>
import component from '../mixins/component';

export default {
  mixins: [component],

  props: {
    collectable: {
      type: Boolean,
      default: true,
    },
  },

  destroyed() {
    // this.playSound('key');
  },
};
</script>

<style lang="scss" scoped>
  .key {
    background: yellow;
  }
</style>
