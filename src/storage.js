export default class Storage {
  namespace;

  driver;

  storage;

  constructor(config, driver = 'localStorage') {
    this.namespace = `${config.namespace}.`;
    this.driver = driver;
    this.storage = window[this.driver];
  }

  isAvailable() {
    try {
      const x = '__storage-test__';

      this.storage.setItem(x, x);
      this.storage.removeItem(x);

      return true;
    } catch (e) {
      return false;
    }
  }

  set(key, value) {
    if (!key || typeof value === 'undefined') {
      return false;
    }

    try {
      let stringifiedValue = value;

      if (typeof value === 'object') {
        stringifiedValue = JSON.stringify(value);
      }

      this.storage.setItem(`${this.namespace}${key}`, stringifiedValue);
    } catch (e) {
      return false;
    }
  }

  get(key) {
    if (!key) {
      return false;
    }

    try {
      return this.storage.getItem(`${this.namespace}${key}`);
    } catch (e) {
      return false;
    }
  }

  remove(key) {
    if (!key) {
      return false;
    }

    try {
      this.storage.removeItem(`${this.namespace}${key}`);
    } catch (e) {
      // eslint-disable-line
    }
  }
}
