export default class Config {
  config;

  constructor() {
    this.config = {
      moveThrottle: 100,
      shootThrottle: 600,
      unit: 32,
    };

    return this.config;
  }
}
