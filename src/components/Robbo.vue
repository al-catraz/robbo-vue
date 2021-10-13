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
import eventBus from '../utils/eventBus';

export default {
  mixins: [component],

  data() {
    return {
      animationTime: 180,
      skinSide: 'down',
      skinStep: 1,
    };
  },

  computed: {
    skinClass() {
      return `robbo-${this.skinSide}-${this.skinStep}`;
    },
  },

  watch: {
    axis() {
      this.setSide();
    },
    direction() {
      this.setSide();
    },
    x(newX, oldX) {
      this.skinSide = newX < oldX ? 'left' : 'right';

      setTimeout(() => {
        this.skinStep = this.skinStep === 2 ? 1 : 2;
      }, this.animationTime);

      eventBus.$emit('play-sound', 'robbo');
    },
    y(newY, oldY) {
      this.skinSide = newY > oldY ? 'down' : 'up';

      setTimeout(() => {
        this.skinStep = this.skinStep === 2 ? 1 : 2;
      }, this.animationTime);

      eventBus.$emit('play-sound', 'robbo');
      eventBus.$emit('move-camera', this.skinSide);
    },
  },

  methods: {
    setSide() {
      if (this.axis === 'x') {
        this.skinSide = this.direction === 'negative' ? 'left' : 'right';
      } else {
        this.skinSide = this.direction === 'negative' ? 'up' : 'down';
      }

      setTimeout(() => {
        this.skinStep = this.skinStep === 2 ? 1 : 2;
      }, this.animationTime);
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
