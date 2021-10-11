<template>
  <div>
    <div
      ref="viewport"
      class="viewport"
    >
      <template v-for="(component, index) in mapGetter">
        <component
          :is="component.name"
          :key="`${component.name}-${index}`"
          :x="component.x"
          :y="component.y"
        />
      </template>
    </div>

    <div class="stats">
      1
    </div>
  </div>
</template>

<script>
// skin per level
// animacja robota
// ------
// lepsze dzwieki
// wykrycie inspectora i blokada
// obsluga pada (najpierw zgranie kopii zapasowej systemu)
import {
  mapGetters,
  mapActions,
} from 'vuex';
import { throttle } from 'lodash';
import Crate from './components/Crate.vue';
import Key from './components/Key.vue';
import Robbo from './components/Robbo.vue';
import Wall from './components/Wall.vue';
import EventBus from './utils/EventBus';

const moveThrottle = 100;

export default {
  components: {
    Crate,
    Key,
    Robbo,
    Wall,
  },

  data() {
    return {
      componentProps: {},
      robboIndex: null,
    };
  },

  computed: {
    ...mapGetters([
      'componentGetter',
      'mapGetter',
    ]),
  },

  // watch: {
  //   mapGetter: {
  //     handler(map) {
  //       console.log(map);
  //     },
  //     deep: true,
  //   },
  // },

  created() {
    this.setComponentPropsAction(this.getComponentPropsMap());
    this.loadMap();

    EventBus.$on('move-camera', this.moveCamera);
    EventBus.$on('move-component', this.moveComponent);
    window.addEventListener('keydown', this.keyDispatcher);
  },

  methods: {
    ...mapActions([
      'setComponentPropsAction',
      'setMapAction',
      'setPositionAction',
    ]),

    getComponentPropsMap() {
      const props = {};

      Object.keys(this.$options.components).forEach((name) => {
        const defaultProps = { ...this.$options.components[name].mixins[0].props };

        delete defaultProps.x;
        delete defaultProps.y;

        props[name] = {
          ...defaultProps,
          ...this.$options.components[name].props,
        };
      });

      Object.keys(props).forEach((name) => {
        Object.keys(props[name]).forEach((prop) => {
          props[name][prop] = props[name][prop].default;
        });
      });

      return props;
    },

    keyDispatcher(event) {
      const method = `key${event.key}`;

      if (typeof this[method] === 'function') {
        this[method].call();
      }
    },

    keyArrowDown: throttle(function () {
      this.moveComponent({
        index: this.robboIndex,
        axis: 'y',
        direction: 'add',
      });
    }, moveThrottle),

    keyArrowUp: throttle(function () {
      this.moveComponent({
        index: this.robboIndex,
        axis: 'y',
        direction: 'subtract',
      });
    }, moveThrottle),

    keyArrowLeft: throttle(function () {
      this.moveComponent({
        index: this.robboIndex,
        axis: 'x',
        direction: 'subtract',
      });
    }, moveThrottle),

    keyArrowRight: throttle(function () {
      this.moveComponent({
        index: this.robboIndex,
        axis: 'x',
        direction: 'add',
      });
    }, moveThrottle),

    async loadMap() {
      const map = 1;

      this.setMapAction(await (await fetch(`maps/${map}.json`)).json());

      this.robboIndex = this.mapGetter.findIndex((component) => component.name === 'Robbo');
    },

    moveCamera(direction) {
      const currentScrollTop = this.$refs.viewport.scrollTop;
      const currentRobboPosition = this.mapGetter.find((component) => component.name === 'Robbo').y;
      const currentOffset = ((currentRobboPosition * this.$config.unit) - currentScrollTop) / this.$config.unit;

      if (direction === 'down' && currentOffset === 8) {
        this.$refs.viewport.scrollTop = (currentRobboPosition * this.$config.unit) - (5 * this.$config.unit);
      } else if (direction === 'up' && currentOffset === 1) {
        this.$refs.viewport.scrollTop = (currentRobboPosition * this.$config.unit) - (4 * this.$config.unit);
      }
    },

    moveComponent({ index, axis, direction }) {
      const component = this.componentGetter(index);

      let {
        x,
        y,
      } = component;

      if (axis === 'x') {
        if (direction === 'add') {
          x += 1;
        } else {
          x -= 1;
        }
      } else if (axis === 'y') {
        if (direction === 'add') {
          y += 1;
        } else {
          y -= 1;
        }
      }

      this.setPositionAction({
        index,
        nextPosition: {
          x,
          y,
        },
      });
    },
  },
};
</script>

<style lang="scss">
  $unit: 32px;

  html,
  body {
    height: 100%;
    overflow: hidden;
  }

  body {
    align-items: center;
    background: #000;
    display: flex;
    justify-content: center;
  }

  .viewport {
    border: 1px solid red;
    height: $unit * 10;
    overflow: hidden;
    position: relative;
    scroll-behavior: smooth;
    width: $unit * 16;
  }

  .component {
    height: $unit;
    position: absolute;
    width: $unit;
  }
</style>
