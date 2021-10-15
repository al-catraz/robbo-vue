<template>
  <div>
    <div class="scene">
      <div
        ref="viewport"
        :class="viewportClass"
      >
        <template v-for="(component, index) in mapGetter">
          <component
            :is="component.name"
            :id="component.id"
            :key="`${component.name}-${index}`"
            :axis="component.axis"
            :capsule-ready="isCapsuleReady"
            :direction="component.direction"
            :x="component.x"
            :y="component.y"
          />
        </template>
      </div>

      <div
        class="curtain"
        :class="{ opened: isCurtainOpened }"
      />
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
// dzialko strzelajace losowo
// rozne kierunki dzialka
// uderzenie strzelu w cos co sie nie niszczy powoduje minimgle
// reset mapy esc
// po zniszczeniu robbo przez dzialko reset levelu i resetCamera()
// dzialko stale
// teleportacja
// niespodzianka
// wybuch bomby i wybuchanie innych bomb dookola w lancuchu
// ------
// wymusic klikniecie w Start zeby byl dziwek na poczatku
// wykrycie inspectora i blokada
import {
  mapGetters,
  mapActions,
} from 'vuex';
import Ammo from './components/Ammo.vue';
import Bomb from './components/Bomb.vue';
import Capsule from './components/Capsule.vue';
import Crate from './components/Crate.vue';
import Door from './components/Door.vue';
import Fog from './components/Fog.vue';
import Key from './components/Key.vue';
import Life from './components/Life.vue';
import Robbo from './components/Robbo.vue';
import Rubble from './components/Rubble.vue';
import Screw from './components/Screw.vue';
import Shot from './components/Shot.vue';
import Wall from './components/Wall.vue';
import animation from './mixins/animation';
import keyboard from './mixins/keyboard';
import eventBus from './utils/eventBus';

export default {
  components: {
    Ammo,
    Bomb,
    Capsule,
    Crate,
    Door,
    Fog,
    Key,
    Life,
    Robbo,
    Rubble,
    Screw,
    Shot,
    Wall,
  },

  mixins: [
    animation,
    keyboard,
  ],

  data() {
    return {
      isCapsuleReady: false,
      isCurtainOpened: false,
      isFlashActive: false,
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
      return [
        'viewport',
        `level-${this.levelGetter}`,
        this.isFlashActive ? 'flash' : null,
      ];
    },
  },

  watch: {
    levelGetter() {
      this.loadMap();
    },

    screwsGetter: {
      handler(screws) {
        if (!screws) {
          eventBus.$emit('capsule-ready');
        }
      },
    },
  },

  created() {
    this.setComponentPropsAction(this.getComponentPropsMap());
    this.setLifesAction(8);
    this.setLevelAction(1);

    eventBus.$on('capsule-ready', this.capsuleReady);
    eventBus.$on('component-collected', this.componentCollected);
    eventBus.$on('component-opened', this.componentOpened);
    eventBus.$on('level-finished', this.levelFinished);
    eventBus.$on('move-camera', this.moveCamera);
    eventBus.$on('move-component', this.moveComponent);
    eventBus.$on('play-sound', this.playSound);
    eventBus.$on('replace-component', this.replaceComponent);
  },

  methods: {
    ...mapActions([
      'addAmmoAction',
      'addKeyAction',
      'addLifeAction',
      'deleteAmmoAction',
      'deleteKeyAction',
      'deleteScrewAction',
      'deleteLifeAction',
      'replaceComponentAction',
      'setComponentPropsAction',
      'setLevelAction',
      'setMapAction',
      'setLifesAction',
      'setComponentPositionAction',
    ]),

    capsuleReady() {
      this.isCapsuleReady = true;

      eventBus.$emit('play-sound', 'flash');

      setTimeout(() => {
        this.isFlashActive = true;

        setTimeout(() => {
          this.isFlashActive = false;
        }, 100);
      }, 200);
    },

    componentCollected(name) {
      const componentCollectedAction = this[`${name === 'Screw' ? 'delete' : 'add'}${name}Action`];

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

    levelFinished() {
      this.isCapsuleReady = false;
      this.isCurtainOpened = false;

      eventBus.$emit('play-sound', 'finish');

      setTimeout(() => {
        this.setLevelAction(2);
      }, this.$config.curtainAnimationTime + 200);
    },

    async loadMap() {
      let map = await (await fetch(`maps/${this.levelGetter}.json`)).json();

      map = map.map((component) => {
        if (this.$config.movableComponents.includes(component.name)) {
          return {
            ...component,
            axis: 'x',
            direction: 'positive',
          };
        }

        return component;
      });

      this.setMapAction(map);

      this.$nextTick(() => {
        this.$refs.viewport.scroll({ top: 31 * this.$config.unit });

        this.resetCamera();

        this.isCurtainOpened = true;
      });
    },

    moveCamera(direction) {
      const currentScrollTop = this.$refs.viewport ? this.$refs.viewport.scrollTop : 0;
      const currentRobboPosition = this.mapGetter.find((component) => component.name === 'Robbo').y;
      const currentOffset = ((currentRobboPosition * this.$config.unit) - currentScrollTop) / this.$config.unit;

      if (direction === 'down' && currentOffset === 8) {
        this.$refs.viewport.scroll({
          behavior: 'smooth',
          top: (currentRobboPosition * this.$config.unit) - (5 * this.$config.unit),
        });
      } else if (direction === 'up' && currentOffset === 1) {
        this.$refs.viewport.scroll({
          behavior: 'smooth',
          top: (currentRobboPosition * this.$config.unit) - (4 * this.$config.unit),
        });
      }
    },

    moveComponent({ id, axis, direction }) {
      this.setComponentPositionAction({
        id,
        axis,
        direction,
      });
    },

    playSound(name) {
      const sound = new Audio(`./audio/${name}.mp3`);

      if (this.$config.isSoundEnabled) {
        sound.play();
      }
    },

    async replaceComponent({ id, name }) {
      const component = await this.replaceComponentAction({ id, name });

      return component;
    },

    async resetCamera() {
      const currentScrollTop = this.$refs.viewport ? this.$refs.viewport.scrollTop : 0;
      const yComponentsCount = currentScrollTop / this.$config.unit;
      const robboComponent = this.componentGetter(this.robboIdGetter);
      const capsuleComponent = await this.replaceComponent({
        id: robboComponent.id,
        name: 'Capsule',
      });

      for (let i = 0; i <= yComponentsCount; i++) {
        setTimeout(() => {
          this.$refs.viewport.scroll({
            behavior: 'smooth',
            top: currentScrollTop - (this.$config.unit * i),
          });

          if (i === yComponentsCount) {
            setTimeout(async () => {
              eventBus.$emit('play-sound', 'birth');

              const fogComponent = await this.replaceComponent({
                id: capsuleComponent.id,
                name: 'Fog',
              });

              setTimeout(() => {
                this.replaceComponent({
                  id: fogComponent.id,
                  name: 'Robbo',
                });
              }, this.$config.fogAnimationTime * 3);
            }, this.$config.robboAnimationTime);
          }
        }, this.$config.moveThrottle * i);
      }
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

  .component {
    height: $unit;
    position: absolute;
    width: $unit;
  }

  .scene {
    position: relative;

    .viewport {
      height: $unit * 10;
      overflow: hidden;
      position: relative;
      width: $unit * 16;

      &.level-1 {
        background-color: #145807;

        .component {
          background-image: url('assets/skins/1.png');
        }
      }

      &.level-2 {
        background-color: powderblue;

        .component {
          background-image: url('assets/skins/1.png');
        }
      }

      &.flash {
        background-color: #fff;
      }
    }

    .curtain {
      background: #000;
      height: 100%;
      left: 0;
      position: absolute;
      top: 0;
      transition: width 1s linear;
      width: 100%;
      z-index: 1;

      &.opened {
        width: 0;
      }
    }
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
