export default class Config {
  config;

  constructor() {
    this.config = {
      capsuleAnimationTime: 500,
      componentsWithDirection: [
        'Robbo',
        'Roller',
      ],
      curtainAnimationTime: 1200,
      drawShotTime: 300,
      flashAnimationTime: 100,
      fogAnimationTime: 80,
      isSoundEnabled: true,
      mapLoadTime: 700,
      moveThrottle: 100,
      robboAnimationTime: 180,
      shootThrottle: 600,
      unit: 32,
    };

    return this.config;
  }
}
