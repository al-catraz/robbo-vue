<template>
  <div
    class="wall"
    :class="componentClass"
    :style="componentPosition"
  />
</template>

<script>
import component from '../mixins/component';

export default {
  mixins: [component],
};
</script>

<style lang="scss" scoped>
  .wall {
    background-position: 0 32px;
  }
</style>
