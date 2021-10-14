import {
  mapGetters,
  mapActions,
} from 'vuex';
import { throttle } from 'lodash';

export default {
  data() {
    return {
      isShiftActive: false,
    };
  },

  computed: {
    ...mapGetters([
      'componentPropsGetter',
      'nextPositionGetter',
      'robboIdGetter',
    ]),
  },

  created() {
    window.addEventListener('keydown', this.keydownHandler);
    window.addEventListener('keyup', this.keyupHandler);

    this.keyArrowDown = throttle(function () {
      const params = {
        id: this.robboIdGetter,
        axis: 'y',
        direction: 'positive',
      };

      if (this.isShiftActive) {
        this.setComponentSideAction(params);
        this.shoot(params);

        return;
      }

      this.moveComponent(params);
    }, this.$config.moveThrottle);

    this.keyArrowUp = throttle(function () {
      const params = {
        id: this.robboIdGetter,
        axis: 'y',
        direction: 'negative',
      };

      if (this.isShiftActive) {
        this.setComponentSideAction(params);
        this.shoot(params);

        return;
      }

      this.moveComponent(params);
    }, this.$config.moveThrottle);

    this.keyArrowLeft = throttle(function () {
      const params = {
        id: this.robboIdGetter,
        axis: 'x',
        direction: 'negative',
      };

      if (this.isShiftActive) {
        this.setComponentSideAction(params);
        this.shoot(params);

        return;
      }

      this.moveComponent(params);
    }, this.$config.moveThrottle);

    this.keyArrowRight = throttle(function () {
      const params = {
        id: this.robboIdGetter,
        axis: 'x',
        direction: 'positive',
      };

      if (this.isShiftActive) {
        this.setComponentSideAction(params);
        this.shoot(params);

        return;
      }

      this.moveComponent(params);
    }, this.$config.moveThrottle);

    this.shoot = throttle(function ({ id, axis, direction }) {
      if (this.isShiftActive) {
        this.shootWithComponentAction({ id, axis, direction });
      }
    }, this.$config.shootThrottle);
  },

  methods: {
    ...mapActions([
      'addComponentAction',
      'removeComponentAction',
      'setComponentSideAction',
      'shootWithComponentAction',
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
