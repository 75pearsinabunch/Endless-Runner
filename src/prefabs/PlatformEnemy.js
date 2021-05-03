class PlatformEnemy extends Enemy {
  constructor(scene, x, y, texture, frame) {
    super(scene, x, y, texture, frame);
    //other stuff dealt with in super-constructor
    this.body.gravity.y = -1000;
    this.body.setVelocityX(gameOptions.floorSpeed);//just stick to the floor
  }

  update() {
    console.log("personalized update");
    if (this.x <= 0 - this.width && this.alive) {
      this.reset();
      score++;
    }

  }
}