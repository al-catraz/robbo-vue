export default class Config {
  config;

  constructor() {
    this.config = {
      capsuleAnimationTime: 500,
      componentsWithDirection: [
        'HalfFog',
        'Robbo',
        'Roller',
      ],
      curtainAnimationTime: 1200,
      flashAnimationTime: 100,
      fogAnimationTime: 80,
      halfFogTime: 300,
      isSoundEnabled: true,
      moveThrottle: 100,
      robboAnimationTime: 180,
      shootThrottle: 600,
      unit: 32,
    };

    return this.config;
  }
}
