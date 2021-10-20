import { difference } from 'lodash';

export default {
  data() {
    return {
      cannonComponents: [],
      componentIntervals: {},
      shotComponents: [],
    };
  },

  watch: {
    mapGetter(newMap, oldMap) {
      const newCannonComponents = newMap.filter((component) => component.name === 'Cannon');
      const oldCannonComponents = oldMap.filter((component) => component.name === 'Cannon');
      const newShotComponents = newMap.filter((component) => component.name === 'Shot');
      const oldShotComponents = oldMap.filter((component) => component.name === 'Shot');

      if (newCannonComponents.length !== oldCannonComponents.length) {
        this.cannonComponents = newCannonComponents;
      }

      if (newShotComponents.length !== oldShotComponents.length) {
        this.shotComponents = newShotComponents;
      }
    },

    cannonComponents(newCannonComponents, oldCannonComponents) {
      const cannonComponent = difference(newCannonComponents, oldCannonComponents)[0];

      if (!cannonComponent) {
        return;
      }

      const cannonComponentId = cannonComponent.id;

      this.componentIntervals[cannonComponentId] = setInterval(drawShot.bind(this), this.$config.drawShotTime);

      function drawShot() {
        const isCannonComponentExisting = this.componentGetter(cannonComponentId);

        if (this.randomWithProbability() === 4) {
          this.shootWithComponentAction(cannonComponent);
        }

        if (!isCannonComponentExisting && this.componentIntervals[cannonComponentId]) {
          clearInterval(this.componentIntervals[cannonComponentId]);
        }
      }
    },

    shotComponents(newShotComponents, oldShotComponents) {
      const shotComponent = difference(newShotComponents, oldShotComponents)[0];
      const intervalHandler = setInterval(moveShot.bind(this), this.$config.moveThrottle);

      function moveShot() {
        const isShotComponentExisting = this.componentGetter(shotComponent.id);

        if (isShotComponentExisting) {
          this.moveComponent(shotComponent);

          return;
        }

        clearInterval(intervalHandler);
      }
    },
  },

  methods: {
    randomWithProbability() {
      const notRandomNumbers = [1, 1, 1, 1, 2, 2, 2, 3, 3, 4];
      const index = Math.floor(Math.random() * notRandomNumbers.length);

      return notRandomNumbers[index];
    },
  },
};
