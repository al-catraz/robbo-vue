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
import { mapGetters } from 'vuex';
import component from '../mixins/component';
import eventBus from '../utils/eventBus';

export default {
  mixins: [component],

  props: {
    movable: {
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
    ...mapGetters([
      'componentGetter',
      'robboIdGetter',
      'screwsGetter',
    ]),

    skinClass() {
      return `capsule-${this.skinStep}`;
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

  created() {
    if (this.capsuleReady) {
      setInterval(() => {
        this.skinStep = this.skinStep === 2 ? 1 : 2;
      }, this.$config.capsuleAnimationTime);
    }
  },
};
</script>

<style lang="scss" scoped>
  .capsule {
     &-1 {
      background-position: 0 -96px;
    }

    &-2 {
      background-position: -32px -96px;
    }
  }
</style>
