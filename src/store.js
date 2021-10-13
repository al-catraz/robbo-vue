import Vue from 'vue';
import Vuex from 'vuex';
import eventBus from './utils/eventBus';
import isCollisionDetected from './utils/collisionDetector';

Vue.use(Vuex);

export default function (/* todo remove config, storage */) {
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

      componentPropsGetter: (state) => state.componentProps,

      keysGetter: (state) => state.keys,

      levelGetter: (state) => state.level,

      lifesGetter: (state) => state.lifes,

      mapGetter: (state) => state.map,

      nextPositionGetter: (state, getters) => (id, axis, direction) => {
        const component = getters.componentGetter(id);

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

      screwsGetter: (state) => state.screws,
    },

    mutations: {
      ammoMutation(state, ammo) {
        state.ammo = ammo;
      },

      componentPositionMutation(state, { id, keys, nextPosition }) {
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

        movingComponent.axis = axis;
        movingComponent.direction = direction;

        if (collision) {
          const collidingComponent = collision.component;

          if (collidingComponent) {
            const collidingComponentName = collidingComponent.name;
            const collidingComponentType = state.componentProps[collidingComponentName];
            const collidingComponentIndex = state.map.findIndex((component) => component.id === collidingComponent.id);

            if (movingComponent.name === 'Robbo') {
              if (collidingComponentType.collectable) {
                state.map.splice(collidingComponentIndex, 1);
                eventBus.$emit('play-sound', collidingComponentName);
                eventBus.$emit('component-collected', collidingComponentName);
              } else if (collidingComponentType.openable && keys) {
                state.map.splice(collidingComponentIndex, 1);
                eventBus.$emit('play-sound', collidingComponentName);
                eventBus.$emit('component-opened', collidingComponentName);
              } else if (collidingComponentType.movable) {
                eventBus.$emit('move-component', {
                  id: collidingComponent.id,
                  axis,
                  direction,
                });
              }

              const robboCollisionAfterMoving = isCollisionDetected(state.map, id, nextPosition);

              if (!robboCollisionAfterMoving && !collidingComponentType.openable) {
                eventBus.$emit('move-component', { id, axis, direction });
              }
            } else if (movingComponent.name === 'Shot') {
              state.map.splice(movingComponentIndex, 1);

              if (collidingComponentType.shootable) {
                state.map.splice(collidingComponentIndex, 1);
                // todo w jego miejsce wstawic animowana chmure
              }
            }
          } else if (movingComponent.name === 'Shot') {
            state.map.splice(movingComponentIndex, 1);
          }
        } else {
          movingComponent.x = x;
          movingComponent.y = y;
        }
      },

      componentSideMutation(state, { id, axis, direction }) {
        const component = state.map.find((component) => component.id === id);

        component.axis = axis;
        component.direction = direction;
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

      removeComponentMutation(state, id) {
        const componentIndex = state.map.findIndex((component) => component.id === id);

        state.map.splice(componentIndex, 1);
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

      removeComponentAction({ commit }, id) {
        commit('removeComponentMutation', id);
      },

      setComponentPositionAction({ getters, commit }, { id, axis, direction }) {
        const nextPosition = getters.nextPositionGetter(id, axis, direction);

        commit('componentPositionMutation', {
          id,
          keys: getters.keysGetter,
          nextPosition,
        });
      },

      setComponentPropsAction({ commit }, componentProps) {
        commit('componentPropsMutation', componentProps);
      },

      setComponentSideAction({ commit }, { id, axis, direction }) {
        commit('componentSideMutation', { id, axis, direction });
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

      shootWithComponentAction({ getters, dispatch }, { id, axis, direction }) {
        const shootingComponent = getters.componentGetter(id);
        const shotComponent = getters.nextPositionGetter(id, axis, direction);

        if (shootingComponent.name === 'Robbo') {
          if (getters.ammoGetter) {
            dispatch('deleteAmmoAction');
          } else {
            return;
          }
        }

        shotComponent.axis = axis;
        shotComponent.direction = direction;
        shotComponent.name = 'Shot';

        eventBus.$emit('play-sound', 'shot');

        if (!isCollisionDetected(getters.mapGetter, id, shotComponent)) {
          dispatch('addComponentAction', shotComponent);
        } else {
          const shootedComponent = getters.mapGetter.find((component) => component.x === shotComponent.x && component.y === shotComponent.y);
          const shootedComponentType = getters.componentPropsGetter[shootedComponent.name];

          if (shootedComponentType.shootable) {
            dispatch('removeComponentAction', shootedComponent.id);
          }
        }
      },
    },
  });
}
