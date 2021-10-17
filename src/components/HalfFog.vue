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
import { mapActions } from 'vuex';
import component from '../mixins/component';

export default {
  mixins: [component],

  data() {
    return {
      skinStep: this.direction === 'positive' ? 1 : 4,
      skinSteps: this.direction === 'positive' ? [1, 2, 3, 4] : [4, 3, 2, 1],
    };
  },

  computed: {
    skinClass() {
      return `half-fog-${this.skinStep}`;
    },
  },

  created() {
    this.skinSteps.forEach((skinStep, index) => {
      setTimeout(() => {
        this.skinStep = skinStep;

        if (index === this.skinSteps.length - 1) {
          this.removeComponentAction(this.id);
        }
      }, (index + 1) * this.$config.fogAnimationTime);
    });
  },

  methods: {
    ...mapActions([
      'removeComponentAction',
    ]),
  },
};
</script>

<style lang="scss" scoped>
  .half-fog {
    &-1 {
      background-position: 0 -64px;
    }

    &-2 {
      background-position: -32px -64px;
    }

    &-3 {
      background-position: -64px -64px;
    }

    &-4 {
      background-position: -96px -64px;
    }
  }
</style>
