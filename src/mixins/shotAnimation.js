import { difference } from 'lodash';

export default {
  watch: {
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
};
