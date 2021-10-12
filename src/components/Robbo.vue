<template>
  <div
    class="robbo"
    :class="[
      componentClass,
      skinClass,
    ]"
    :style="componentPosition"
  />
</template>

<script>
import component from '../mixins/component';
import EventBus from '../utils/EventBus';

export default {
  mixins: [component],

  data() {
    return {
      animationTime: 180,
      skinDirection: 'down',
      skinStep: 1,
    };
  },

  computed: {
    skinClass() {
      return `robbo-${this.skinDirection}-${this.skinStep}`;
    },
  },

  watch: {
    x(newX, oldX) {
      this.skinDirection = newX < oldX ? 'left' : 'right';

      setTimeout(() => {
        this.skinStep = newX % 2 === 0 ? 1 : 2;
      }, this.animationTime);

      EventBus.$emit('play-sound', 'robbo');
    },
    y(newY, oldY) {
      this.skinDirection = newY > oldY ? 'down' : 'up';

      setTimeout(() => {
        this.skinStep = newY % 2 === 0 ? 1 : 2;
      }, this.animationTime);

      EventBus.$emit('play-sound', 'robbo');
      EventBus.$emit('move-camera', this.skinDirection);
    },
  },
};
</script>

<style lang="scss" scoped>
  .robbo {
    &-down-1 {
      background-position: 0 0;
    }

    &-down-2 {
      background-position: -32px 0;
    }

    &-up-1 {
      background-position: -64px 0;
    }

    &-up-2 {
      background-position: -96px 0;
    }

    &-left-1 {
      background-position: -128px 0;
    }

    &-left-2 {
      background-position: -160px 0;
    }

    &-right-1 {
      background-position: -192px 0;
    }

    &-right-2 {
      background-position: -224px 0;
    }
  }
</style>
