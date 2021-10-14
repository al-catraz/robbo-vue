<template>
  <div
    class="shot"
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

  props: {
    axis: {
      default: 'x',
      type: String,
    },

    damaging: {
      type: Boolean,
      default: true,
    },
  },

  data() {
    return {
      skinStep: 1,
    };
  },

  computed: {
    skinClass() {
      return `shot-${this.axis}-${this.skinStep}`;
    },
  },

  watch: {
    x() {
      this.skinStep = this.skinStep === 2 ? 1 : 2;
    },
    y() {
      this.skinStep = this.skinStep === 2 ? 1 : 2;
    },
  },
};
</script>

<style lang="scss" scoped>
  .shot {
    &-x-1 {
      background-position: -64px -32px;
    }

    &-x-2 {
      background-position: -96px -32px;
    }

    &-y-1 {
      background-position: 0 -32px;
    }

    &-y-2 {
      background-position: -32px -32px;
    }
  }
</style>
