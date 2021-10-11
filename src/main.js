import Vue from 'vue';
import Main from './Main.vue';
import Config from './config';
import Storage from './storage';
import Store from './store';

const config = new Config();
const storage = new Storage(config);
const session = new Storage(config, 'sessionStorage');
const store = new Store(config, storage);

Vue.config.productionTip = !config.isProduction;
Vue.prototype.$config = config;
Vue.prototype.$storage = storage;
Vue.prototype.$session = session;

new Vue({
  el: '#main',
  store,
  render(createElement) {
    return createElement(Main);
  },
});
