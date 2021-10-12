<template>
  <div
    class="component crate"
    :class="componentClass"
    :style="componentPosition"
  />
</template>

<script>
import component from '../mixins/component';
import eventBus from '../utils/eventBus';

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
      eventBus.$emit('play-sound', 'move');
    },
    y() {
      eventBus.$emit('play-sound', 'move');
    },
  },
};
</script>

<style lang="scss" scoped>
  .crate {
    background-position: -32px 32px;
  }
</style>
