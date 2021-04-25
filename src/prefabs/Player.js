//sort of guessing about how to construct this
class Player extends Phaser.Physics.Arcade.Sprite{
  constructor(scene, posX, posY, texture){
    super(scene,posX,posY, texture);
    scene.physics.add.existing(this);//sets up physics object
    scene.add.existing(this);//sets up sprite object

    this.vel = 0;
    this.color = colors.RED;
  }

  colorChange(color){
    this.color = color;
    this.setTint(this.color);
    if(this.color === this.scene.currColor){
      this.body.setVelocityX(10);
    }else{
      this.body.setVelocityX(0);
    }
    
  }

}