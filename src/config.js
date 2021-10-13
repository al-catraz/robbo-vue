export default class Config {
  config;

  constructor() {
    this.config = {
      isSoundEnabled: true,
      movableComponents: [
        'Robbo',
        'Roller',
      ],
      moveThrottle: 100,
      shootThrottle: 700,
      unit: 32,
    };

    return this.config;
  }
}
