<template>
  <div
    class="component robbo"
    :style="position"
  />
</template>

<script>
import component from '../mixins/component';
import EventBus from '../utils/EventBus';

export default {
  mixins: [component],

  watch: {
    x() {
      this.playSound('robbo');
    },
    y(newY, oldY) {
      const direction = newY > oldY ? 'down' : 'up';

      this.playSound('robbo');

      EventBus.$emit('move-camera', direction);
    },
  },
};
</script>

<style lang="scss" scoped>
  .robbo {
    background: white;
  }
</style>
