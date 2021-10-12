import { throttle } from 'lodash';
import { mapActions } from 'vuex';

export default {
  data() {
    return {
      isShiftActive: false,
      robboId: null,
    };
  },

  created() {
    window.addEventListener('keydown', this.keydownHandler);
    window.addEventListener('keyup', this.keyupHandler);

    this.keyArrowDown = throttle(function () {
      const params = {
        id: this.robboId,
        axis: 'y',
        direction: 'positive',
      };

      if (this.isShiftActive) {
        this.shootWithComponent(params);

        return;
      }

      this.moveComponent(params);
    }, this.$config.moveThrottle);

    this.keyArrowUp = throttle(function () {
      const params = {
        id: this.robboId,
        axis: 'y',
        direction: 'negative',
      };

      if (this.isShiftActive) {
        this.shootWithComponent(params);

        return;
      }

      this.moveComponent(params);
    }, this.$config.moveThrottle);

    this.keyArrowLeft = throttle(function () {
      const params = {
        id: this.robboId,
        axis: 'x',
        direction: 'negative',
      };

      if (this.isShiftActive) {
        this.shootWithComponent(params);

        return;
      }

      this.moveComponent(params);
    }, this.$config.moveThrottle);

    this.keyArrowRight = throttle(function () {
      const params = {
        id: this.robboId,
        axis: 'x',
        direction: 'positive',
      };

      if (this.isShiftActive) {
        this.shootWithComponent(params);

        return;
      }

      this.moveComponent(params);
    }, this.$config.moveThrottle);

    this.shootWithComponent = throttle(function ({ id, axis, direction }) {
      const shootingComponent = this.componentGetter(id);
      const shotComponent = this.getNextPosition(id, axis, direction);

      if (shootingComponent.name === 'Robbo') {
        if (this.ammoGetter) {
          this.deleteAmmoAction();
        } else {
          return;
        }
      }

      shotComponent.axis = axis;
      shotComponent.direction = direction;
      shotComponent.name = 'Shot';

      this.addComponentAction(shotComponent);
      this.playSound('shot');
    }, this.$config.shootThrottle);
  },

  watch: {
    mapGetter(newMap, oldMap) {
      if (!oldMap.length) {
        this.robboId = this.mapGetter.find((component) => component.name === 'Robbo').id;
      }
    },
  },

  methods: {
    ...mapActions([
      'addComponentAction',
    ]),

    keydownHandler(event) {
      if (event.key === 'Shift') {
        this.isShiftActive = true;
      }

      this.keyDispatcher(event);
    },

    keyupHandler(event) {
      if (event.key === 'Shift') {
        this.isShiftActive = false;
      }
    },

    keyDispatcher(event) {
      const method = `key${event.key}`;

      if (typeof this[method] === 'function') {
        this[method]();
      }
    },
  },
};
