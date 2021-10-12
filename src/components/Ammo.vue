<template>
  <div
    class="ammo"
    :class="componentClass"
    :style="componentPosition"
  />
</template>

<script>
import component from '../mixins/component';

export default {
  mixins: [component],

  props: {
    collectable: {
      type: Boolean,
      default: true,
    },
  },
};
</script>

<style lang="scss" scoped>
  .ammo {
    background-position: -96px 32px;
  }
</style>
