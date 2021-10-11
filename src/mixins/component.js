import { mapGetters } from 'vuex';

export default {
  props: {
    collectable: {
      default: false,
      type: Boolean,
    },
    movable: {
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
    ...mapGetters([

    ]),

    position() {
      return { left: `${this.x * this.$config.unit}px`, top: `${this.y * this.$config.unit}px` };
    },
  },

  methods: {
    playSound(name) {
      const sound = new Audio(`./audio/${name}.mp3`);

      sound.play();
    },
  },
};
