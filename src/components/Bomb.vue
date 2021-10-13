<template>
  <div
    class="component bomb"
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
    explodable: {
      type: Boolean,
      default: true,
    },

    movable: {
      type: Boolean,
      default: true,
    },

    shootable: {
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
  .bomb {
    background-position: -128px 32px;
  }
</style>
