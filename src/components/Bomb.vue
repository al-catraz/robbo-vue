<template>
  <div
    class="component bomb"
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
    explodable: {
      type: Boolean,
      default: true,
    },

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
  .bomb {
    background-position: -128px 32px;
  }
</style>
