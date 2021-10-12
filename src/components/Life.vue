<template>
  <div
    class="life"
    :class="componentClass"
    :style="componentPosition"
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
};
</script>

<style lang="scss" scoped>
  .life {
    background-position: -288px 32px;
  }
</style>
