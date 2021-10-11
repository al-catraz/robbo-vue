<template>
  <div
    class="component wall"
    :style="position"
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
    background: red;
  }
</style>
