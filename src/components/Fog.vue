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

const skinSteps = [1, 2, 3, 4, 3, 2, 1];

export default {
  mixins: [component],

  data() {
    return {
      skinStep: 1,
    };
  },

  computed: {
    skinClass() {
      return `fog-${this.skinStep}`;
    },
  },

  created() {
    skinSteps.forEach((skinStep, index) => {
      setTimeout(() => {
        this.skinStep = skinStep;

        if (index === skinSteps.length - 1) {
          this.removeComponentAction(this.id);
        }
      }, index * this.$config.fogAnimationTime);
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
  .fog {
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
