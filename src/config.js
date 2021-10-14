export default class Config {
  config;

  constructor() {
    this.config = {
      fogAnimationTime: 100,
      isSoundEnabled: true,
      movableComponents: [
        'Robbo',
        'Roller',
      ],
      moveThrottle: 100,
      robboAnimationTime: 180,
      shootThrottle: 600,
      unit: 32,
    };

    return this.config;
  }
}
