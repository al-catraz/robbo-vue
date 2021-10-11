import Vue from 'vue';
import Vuex from 'vuex';
import EventBus from './utils/EventBus';

Vue.use(Vuex);

function isCollisionDetected(map, index, nextPosition) {
  let collision = false;

  if (
    (nextPosition.x < 0 || nextPosition.x > 15)
    || (nextPosition.y < 0 || nextPosition.y > 30)
  ) {
    collision = { collidingComponent: null };
  }

  map.forEach((component, componentIndex) => {
    if (
      !collision
      && componentIndex !== index
      && (component.x === nextPosition.x && component.y === nextPosition.y)
    ) {
      collision = {
        collidingComponent: component,
        collidingComponentIndex: componentIndex,
      };
    }
  });

  return collision;
}

export default function (/* config, storage */) {
  return new Vuex.Store({
    state: {
      componentProps: {},
      map: [],
    },

    getters: {
      componentGetter: (state) => (index) => state.map[index],

      mapGetter: (state) => state.map,
    },

    mutations: {
      componentPropsMutation(state, componentProps) {
        state.componentProps = componentProps;
      },

      positionMutation(state, { index, nextPosition }) {
        const {
          x,
          y,
        } = nextPosition;
        const collision = isCollisionDetected(state.map, index, nextPosition);
        const movingComponent = state.map[index];

        let axis = null;
        let direction = null;

        if (nextPosition.x !== movingComponent.x) {
          axis = 'x';
          direction = (nextPosition.x - movingComponent.x) > 0 ? 'add' : 'subtract';
        } else {
          axis = 'y';
          direction = (nextPosition.y - movingComponent.y) > 0 ? 'add' : 'subtract';
        }

        if (collision) {
          if (collision.collidingComponent) {
            if (
              movingComponent.name === 'Robbo'
              && state.componentProps[collision.collidingComponent.name].collectable
            ) {
              state.map.splice(collision.collidingComponentIndex, 1);
            } else if (
              movingComponent.name === 'Robbo'
              && state.componentProps[collision.collidingComponent.name].movable
            ) {
              EventBus.$emit('move-component', {
                index: collision.collidingComponentIndex,
                axis,
                direction,
              });
            }

            const robboCollisionAfterMoving = isCollisionDetected(state.map, index, nextPosition);

            if (!robboCollisionAfterMoving) {
              EventBus.$emit('move-component', {
                index,
                axis,
                direction,
              });
            }
          }
        } else {
          state.map[index].x = x;
          state.map[index].y = y;
        }
      },

      mapMutation(state, map) {
        state.map = map;
      },
    },

    actions: {
      setComponentPropsAction({ commit }, componentProps) {
        commit('componentPropsMutation', componentProps);
      },

      setPositionAction({ commit }, { index, nextPosition }) {
        commit('positionMutation', { index, nextPosition });
      },

      setMapAction({ commit }, map) {
        commit('mapMutation', map);
      },
    },
  });
}
