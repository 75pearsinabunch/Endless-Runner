class PlatformEnemy extends Enemy {
  constructor(scene, x, y, texture, frame) {
    super(scene, x, y, texture, frame);
    //other stuff dealt with in super-constructor
    this.body.gravity.y = -1000;
    this.body.setVelocityX(0);//just stick to the floor
  }

  jump(){//overwriting jump to reverse it
    this.body.setVelocityY(-this.jumpPower);
  }
}