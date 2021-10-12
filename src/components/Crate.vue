<template>
  <div
    class="component crate"
    :class="componentClass"
    :style="componentPosition"
  />
</template>

<script>
import component from '../mixins/component';
import EventBus from '../utils/eventBus';

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
      EventBus.$emit('play-sound', 'move');
    },
    y() {
      EventBus.$emit('play-sound', 'move');
    },
  },
};
</script>

<style lang="scss" scoped>
  .crate {
    background-position: -32px 32px;
  }
</style>
