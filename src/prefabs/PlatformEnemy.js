//Just like Enemy class but gravity is reversed 
//and it doesnt move
class PlatformEnemy extends Enemy {
  constructor(scene, x, y, atlas, texture, frame) {
    super(scene, x, y, atlas, texture, frame);
    //other stuff dealt with in super-constructor
    this.body.gravity.y = -1000;
    this.body.setVelocityX(-300);//just stick to the floor
  }

  jump(){
    //does nothing for this enemy
  }
}