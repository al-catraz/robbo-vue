export default {
  props: {
    axis: {
      default: null,
      type: String,
    },
    collectable: {
      default: false,
      type: Boolean,
    },
    damaging: {
      default: false,
      type: Boolean,
    },
    direction: {
      default: null,
      type: String,
    },
    explodable: {
      default: false,
      type: Boolean,
    },
    id: {
      default: null,
      type: Number,
    },
    movable: {
      default: false,
      type: Boolean,
    },
    openable: {
      default: false,
      type: Boolean,
    },
    x: {
      default: 0,
      type: Number,
    },
    y: {
      default: 0,
      type: Number,
    },
  },

  computed: {
    componentClass() {
      return 'component';
    },

    componentPosition() {
      return { left: `${this.x * this.$config.unit}px`, top: `${this.y * this.$config.unit}px` };
    },
  },
};
