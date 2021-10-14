import { difference } from 'lodash';

export default {
  data() {
    return {
      shotComponents: [],
    };
  },

  watch: {
    mapGetter(newMap, oldMap) {
      const newShotComponents = newMap.filter((component) => component.name === 'Shot');
      const oldShotComponents = oldMap.filter((component) => component.name === 'Shot');

      if (newShotComponents.length !== oldShotComponents.length) {
        this.shotComponents = newShotComponents;
      }
    },

    shotComponents(newShotComponents, oldShotComponents) {
      const shotComponent = difference(newShotComponents, oldShotComponents)[0];
      const intervalHandler = setInterval(moveShot.bind(this), this.$config.moveThrottle);

      function moveShot() {
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
    },
  },
};
