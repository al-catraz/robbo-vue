<template>
  <div>
    <div
      ref="viewport"
      :class="viewportClass"
    >
      <template v-for="(component, index) in mapGetter">
        <component
          :is="component.name"
          :key="`${component.name}-${index}`"
          :axis="component.axis"
          :x="component.x"
          :y="component.y"
        />
      </template>
    </div>

    <div class="stats">
      <div>
        <div class="stat screws"/>
        {{ screwsGetter.toString().padStart(2, 0) }}
      </div>

      <div>
        <div class="stat lifes"/>
        {{ lifesGetter.toString().padStart(2, 0) }}
      </div>

      <div>
        <div class="stat keys"/>
        {{ keysGetter.toString().padStart(2, 0) }}
      </div>

      <div>
        <div class="stat ammo"/>
        {{ ammoGetter.toString().padStart(2, 0) }}
      </div>

      <div>
        <div class="stat level"/>
        {{ levelGetter.toString().padStart(2, 0) }}
      </div>
    </div>
  </div>
</template>

<script>
// wyniesc animacje strzalu do mixinu
// wyniesc sprawdzanie kolizji
// zmiana kierunku robbo przy strzale w inna strone
// gruz
// usuwanie gruzu
// niespodzianka
// wybuch bomby
// ------
// animacja wgrania mapy i urodzin robbo
// reset mapy esc
// wykrycie inspectora i blokada
// lepszy dzwiek chodzenia robota
import {
  mapGetters,
  mapActions,
} from 'vuex';
import { difference } from 'lodash';
import Ammo from './components/Ammo.vue';
import Bomb from './components/Bomb.vue';
import Crate from './components/Crate.vue';
import Door from './components/Door.vue';
import Key from './components/Key.vue';
import Life from './components/Life.vue';
import Robbo from './components/Robbo.vue';
import Screw from './components/Screw.vue';
import Shot from './components/Shot.vue';
import Wall from './components/Wall.vue';
import keyboard from './mixins/keyboard';
import EventBus from './utils/EventBus';

export default {
  components: {
    Ammo,
    Bomb,
    Crate,
    Door,
    Key,
    Life,
    Robbo,
    Screw,
    Shot,
    Wall,
  },

  mixins: [keyboard],

  data() {
    return {
      shotComponents: [],
    };
  },

  computed: {
    ...mapGetters([
      'ammoGetter',
      'componentGetter',
      'keysGetter',
      'levelGetter',
      'lifesGetter',
      'mapGetter',
      'screwsGetter',
    ]),

    viewportClass() {
      return `viewport level-${this.levelGetter}`;
    },
  },

  watch: {
    levelGetter() {
      this.loadMap();
    },

    mapGetter(newMap, oldMap) {
      const newShotComponents = newMap.filter((component) => component.name === 'Shot');
      const oldShotComponents = oldMap.filter((component) => component.name === 'Shot');

      if (newShotComponents.length !== oldShotComponents.length) {
        this.shotComponents = newShotComponents;
      }
    },

    shotComponents(newShotComponents, oldShotComponents) {
      const shotComponent = difference(newShotComponents, oldShotComponents)[0];

      let intervalHandler = null;

      function animateShot() {
        const isShotComponentExisting = this.componentGetter(shotComponent.id);

        if (isShotComponentExisting) {
          this.moveComponent({
            id: shotComponent.id,
            axis: shotComponent.axis,
            direction: shotComponent.direction,
          });

          return;
        }

        clearInterval(intervalHandler);
      }

      intervalHandler = setInterval(animateShot.bind(this), this.$config.moveThrottle);
    },
  },

  created() {
    this.setComponentPropsAction(this.getComponentPropsMap());
    this.setLifesAction(8);
    this.setLevelAction(1);

    EventBus.$on('component-collected', this.componentCollected);
    EventBus.$on('component-opened', this.componentOpened);
    EventBus.$on('move-camera', this.moveCamera);
    EventBus.$on('move-component', this.moveComponent);
    EventBus.$on('play-sound', this.playSound);
  },

  methods: {
    ...mapActions([
      'addAmmoAction',
      'addKeyAction',
      'addLifeAction',
      'addScrewAction',
      'deleteAmmoAction',
      'deleteKeyAction',
      'deleteLifeAction',
      'setComponentPropsAction',
      'setLevelAction',
      'setMapAction',
      'setLifesAction',
      'setPositionAction',
    ]),

    componentCollected(name) {
      const componentCollectedAction = this[`add${name}Action`];

      if (typeof componentCollectedAction === 'function') {
        componentCollectedAction();
      }
    },

    componentOpened() {
      this.deleteKeyAction();
    },

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

    getNextPosition(id, axis, direction) {
      const component = this.componentGetter(id);

      let {
        x,
        y,
      } = component;

      if (axis === 'x') {
        if (direction === 'positive') {
          x += 1;
        } else {
          x -= 1;
        }
      } else if (axis === 'y') {
        if (direction === 'positive') {
          y += 1;
        } else {
          y -= 1;
        }
      }

      return {
        x,
        y,
      };
    },

    async loadMap() {
      this.setMapAction(await (await fetch(`maps/${this.levelGetter}.json`)).json());
    },

    moveCamera(direction) {
      const currentScrollTop = this.$refs.viewport ? this.$refs.viewport.scrollTop : 0;
      const currentRobboPosition = this.mapGetter.find((component) => component.name === 'Robbo').y;
      const currentOffset = ((currentRobboPosition * this.$config.unit) - currentScrollTop) / this.$config.unit;

      if (direction === 'down' && currentOffset === 8) {
        this.$refs.viewport.scrollTop = (currentRobboPosition * this.$config.unit) - (5 * this.$config.unit);
      } else if (direction === 'up' && currentOffset === 1) {
        this.$refs.viewport.scrollTop = (currentRobboPosition * this.$config.unit) - (4 * this.$config.unit);
      }
    },

    moveComponent({ id, axis, direction }) {
      const nextPosition = this.getNextPosition(id, axis, direction);

      this.setPositionAction({
        id,
        nextPosition,
      });
    },

    playSound(name) {
      const sound = new Audio(`./audio/${name}.mp3`);

      sound.play();
    },
  },
};
</script>

<style lang="scss">
  @import 'assets/fonts';

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
    height: $unit * 10;
    overflow: hidden;
    position: relative;
    scroll-behavior: smooth;
    width: $unit * 16;

    &.level-1 {
      background-color: #145807;

      .component {
        background-image: url('assets/skins/1.png');
      }
    }
  }

  .component {
    height: $unit;
    position: absolute;
    width: $unit;
  }

  .stats {
    color: #959595;
    display: flex;
    font-family: 'digital';
    font-size: 28px;
    justify-content: space-between;
    letter-spacing: -6px;
    margin-top: 20px;

    .stat {
      background-image: url('assets/stats.png');
      float: left;
      height: $unit;
      margin-top: 3px;
      width: $unit;

      &.screws {
        background-position: 0 0;
      }

      &.lifes {
        background-position: -32px 0;
      }

      &.keys {
        background-position: -64px 0;
      }

      &.ammo {
        background-position: -96px 0;
      }

      &.level {
        background-position: -128px 0;
      }
    }
  }
</style>
