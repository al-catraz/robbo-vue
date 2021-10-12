import Vue from 'vue';
import Vuex from 'vuex';
import EventBus from './utils/eventBus';

Vue.use(Vuex);

function isCollisionDetected(map, id, nextPosition) {
  let collision = null;

  if (
    (nextPosition.x < 0 || nextPosition.x > 15)
    || (nextPosition.y < 0 || nextPosition.y > 30)
  ) {
    collision = { component: null };
  }

  map.forEach((component) => {
    if (
      !collision
      && component.id !== id
      && (component.x === nextPosition.x && component.y === nextPosition.y)
    ) {
      collision = { component };
    }
  });

  return collision;
}

export default function (/* config, storage */) {
  return new Vuex.Store({
    state: {
      ammo: 0,
      componentProps: {},
      level: 0,
      keys: 0,
      lifes: 0,
      map: [],
      screws: 0,
    },

    getters: {
      ammoGetter: (state) => state.ammo,

      componentGetter: (state, getters) => (id) => getters.mapGetter.find((component) => component.id === id),

      keysGetter: (state) => state.keys,

      levelGetter: (state) => state.level,

      lifesGetter: (state) => state.lifes,

      mapGetter: (state) => state.map,

      screwsGetter: (state) => state.screws,
    },

    mutations: {
      ammoMutation(state, ammo) {
        state.ammo = ammo;
      },

      componentPropsMutation(state, componentProps) {
        state.componentProps = componentProps;
      },

      keysMutation(state, keys) {
        state.keys = keys;
      },

      levelMutation(state, level) {
        state.level = level;
      },

      lifesMutation(state, lifes) {
        state.lifes = lifes;
      },

      mapMutation(state, map) {
        if (Array.isArray(map)) {
          state.map = map;

          return;
        }

        const newMap = [...state.map];

        newMap.push(map);

        state.map = newMap;
      },

      positionMutation(state, { id, keys, nextPosition }) {
        const {
          x,
          y,
        } = nextPosition;
        const collision = isCollisionDetected(state.map, id, nextPosition);
        const movingComponent = state.map.find((component) => component.id === id);
        const movingComponentIndex = state.map.findIndex((component) => component.id === movingComponent.id);

        let axis = null;
        let direction = null;

        if (nextPosition.x !== movingComponent.x) {
          axis = 'x';
          direction = (nextPosition.x - movingComponent.x) > 0 ? 'positive' : 'negative';
        } else {
          axis = 'y';
          direction = (nextPosition.y - movingComponent.y) > 0 ? 'positive' : 'negative';
        }

        if (collision) {
          if (collision.component) {
            const componentName = collision.component.name;
            const componentType = state.componentProps[componentName];
            const collidingComponentIndex = state.map.findIndex((component) => component.id === collision.component.id);

            if (movingComponent.name === 'Robbo') {
              if (componentType.collectable) {
                state.map.splice(collidingComponentIndex, 1);
                EventBus.$emit('play-sound', componentName);
                EventBus.$emit('component-collected', componentName);
              } else if (componentType.openable && keys) {
                state.map.splice(collidingComponentIndex, 1);
                EventBus.$emit('play-sound', componentName);
                EventBus.$emit('component-opened', componentName);
              } else if (componentType.movable) {
                EventBus.$emit('move-component', {
                  id: collision.component.id,
                  axis,
                  direction,
                });
              }

              const robboCollisionAfterMoving = isCollisionDetected(state.map, id, nextPosition);

              if (!robboCollisionAfterMoving && !componentType.openable) {
                EventBus.$emit('move-component', {
                  id,
                  axis,
                  direction,
                });
              }
            } else if (movingComponent.name === 'Shot') {
              state.map.splice(movingComponentIndex, 1);
              // todo tutaj usunac obiekt state.map.splice(collidingComponentIndex, 1);
              // i w jego miejsce wstawic animowana chmure
            }
          } else if (movingComponent.name === 'Shot') {
            state.map.splice(movingComponentIndex, 1);
          }
        } else {
          movingComponent.x = x;
          movingComponent.y = y;
        }
      },

      screwsMutation(state, screws) {
        state.screws = screws;
      },
    },

    actions: {
      addAmmoAction({ getters, commit }) {
        commit('ammoMutation', getters.ammoGetter + 9);
      },

      addComponentAction({ getters, commit }, component) {
        component.id = getters.mapGetter[getters.mapGetter.length - 1].id + 1;

        commit('mapMutation', component);
      },

      addKeyAction({ getters, commit }) {
        commit('keysMutation', getters.keysGetter + 1);
      },

      addLifeAction({ getters, commit }) {
        commit('lifesMutation', getters.lifesGetter + 1);
      },

      addScrewAction({ getters, commit }) {
        commit('screwsMutation', getters.screwsGetter + 1);
      },

      deleteAmmoAction({ getters, commit }) {
        commit('ammoMutation', getters.ammoGetter - 1);
      },

      deleteKeyAction({ getters, commit }) {
        commit('keysMutation', getters.keysGetter - 1);
      },

      deleteLifeAction({ getters, commit }) {
        commit('lifesMutation', getters.lifesGetter - 1);
      },

      setComponentPropsAction({ commit }, componentProps) {
        commit('componentPropsMutation', componentProps);
      },

      setLevelAction({ commit }, level) {
        commit('levelMutation', level);
      },

      setLifesAction({ commit }, lifes) {
        commit('lifesMutation', lifes);
      },

      setMapAction({ commit }, map) {
        map.map((component, index) => {
          component.id = index + 1;

          return component;
        });

        commit('mapMutation', map);
      },

      setPositionAction({ getters, commit }, { id, nextPosition }) {
        commit('positionMutation', {
          id,
          keys: getters.keysGetter,
          nextPosition,
        });
      },
    },
  });
}
