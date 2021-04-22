class Loading extends Phaser.Scene{
  constructor(){
    super('loadScene');
  }

  preload(){

  }

  create(){
    this.scene.start('runScene')
  }
}