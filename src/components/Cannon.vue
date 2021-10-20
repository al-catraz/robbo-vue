<template>
  <div
    :class="[
      componentClass,
      skinClass,
    ]"
    :style="componentPosition"
  />
</template>

<script>
import component from '../mixins/component';

export default {
  mixins: [component],

  data() {
    return {
      skinSide: 'down',
    };
  },

  computed: {
    skinClass() {
      return `cannon-${this.skinSide}`;
    },
  },

  watch: {
    axis: {
      immediate: true,
      handler() {
        this.setSide();
      },
    },
    direction: {
      immediate: true,
      handler() {
        this.setSide();
      },
    },
    x(newX, oldX) {
      this.skinSide = newX < oldX ? 'left' : 'right';
    },
    y(newY, oldY) {
      this.skinSide = newY > oldY ? 'down' : 'up';
    },
  },

  methods: {
    setSide() {
      if (this.axis === 'x') {
        this.skinSide = this.direction === 'negative' ? 'left' : 'right';
      } else {
        this.skinSide = this.direction === 'negative' ? 'up' : 'down';
      }
    },
  },
};
</script>

<style lang="scss" scoped>
  .cannon {
    &-down {
      background-position: 0 96px;
    }

    &-up {
      background-position: -32px 96px;
    }

    &-left {
      background-position: -64px 96px;
    }

    &-right {
      background-position: -96px 96px;
    }
  }
</style>
